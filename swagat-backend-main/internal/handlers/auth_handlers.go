package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct{ DB *pgxpool.Pool }

func NewAuthHandler(db *pgxpool.Pool) *AuthHandler { return &AuthHandler{DB: db} }

type registerReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required"`
	Role     string `json:"role" binding:"required,oneof=super_admin department_admin applicant"`
}

// Register creates a user. eKYC is mocked (scope cut, Section 21/23):
// applicant registration is treated as "eKYC verified" immediately, no real Aadhaar call.
func (h *AuthHandler) Register(c *gin.Context) {
	var req registerReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "hash failed"})
		return
	}

	id := uuid.New().String()
	_, err = h.DB.Exec(c, `
		INSERT INTO users (id, email, password_hash, full_name, role) VALUES ($1,$2,$3,$4,$5)
	`, id, req.Email, string(hash), req.FullName, req.Role)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "email already registered or invalid: " + err.Error()})
		return
	}

	if req.Role == "applicant" {
		_, err = h.DB.Exec(c, `INSERT INTO applicants (id, user_id) VALUES ($1, $2)`, uuid.New().String(), id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "applicant profile creation failed"})
			return
		}
	}

	token, err := signToken(id, req.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token signing failed"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"token": token, "user_id": id, "ekyc_verified": true})
}

type loginReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var id, hash, role string
	err := h.DB.QueryRow(c, `SELECT id, password_hash, role FROM users WHERE email=$1`, req.Email).Scan(&id, &hash, &role)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token, err := signToken(id, role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token signing failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token, "user_id": id, "role": role})
}
