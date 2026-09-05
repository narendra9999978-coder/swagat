package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/solvix/swagat/internal/db"
	"github.com/solvix/swagat/internal/dispatch"
	"github.com/solvix/swagat/internal/handlers"
	"github.com/solvix/swagat/internal/routing"
	"github.com/solvix/swagat/internal/tree"
)

func main() {
	if err := db.Connect(); err != nil {
		log.Fatalf("db connect: %v", err)
	}
	defer db.Pool.Close()

	treeEngine := tree.NewEngine(db.Pool)
	router := routing.NewRouter(db.Pool)
	dispatchEngine := dispatch.NewEngine(db.Pool, router, treeEngine)

	authH := handlers.NewAuthHandler(db.Pool)
	adminH := handlers.NewAdminHandler(db.Pool, treeEngine)
	applicantH := handlers.NewApplicantHandler(db.Pool, treeEngine, dispatchEngine)
	deptH := handlers.NewDeptAdminHandler(db.Pool, router)

	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.GET("/healthz", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) })

	// ---- public auth ----
	r.POST("/auth/register", authH.Register)
	r.POST("/auth/login", authH.Login)

	// ---- Super Admin ----
	admin := r.Group("/admin", handlers.AuthRequired(), handlers.RequireRole("super_admin"))
	{
		admin.POST("/business-types", adminH.CreateBusinessType)
		admin.GET("/business-types", adminH.ListBusinessTypes)

		admin.POST("/departments", adminH.CreateDepartment)
		admin.GET("/departments", adminH.ListDepartments)

		admin.POST("/document-types", adminH.CreateDocumentType)

		admin.POST("/business-nodes", adminH.CreateBusinessNode)
		admin.POST("/org-nodes", adminH.CreateOrgNode)
		admin.POST("/leaf-documents", adminH.AttachLeafDocument)

		admin.POST("/business-types/:businessTypeID/steps/:step/import", adminH.ImportBusinessTree)
		admin.POST("/departments/:departmentID/org-tree/import", adminH.ImportOrgTree)

		admin.GET("/business-types/:businessTypeID/steps/:step/tree", adminH.ViewBusinessTree)
		admin.GET("/departments/:departmentID/org-tree", adminH.ViewOrgTree)
		admin.GET("/departments/:departmentID/coverage", adminH.OrgCoverage)
	}

	// ---- Applicant ----
	applicant := r.Group("/apply", handlers.AuthRequired(), handlers.RequireRole("applicant"))
	{
		applicant.GET("/business-types", adminH.ListBusinessTypes) // read-only list, any authed applicant
		applicant.POST("/applications", applicantH.StartApplication)
		applicant.GET("/walk", applicantH.WalkStep)
		applicant.POST("/answer", applicantH.AnswerLeaf)
		applicant.GET("/applications/:applicationID/checklist", applicantH.BuildChecklist)
		applicant.POST("/documents/:appDocID/upload", applicantH.UploadDocument)
		applicant.POST("/applications/:applicationID/submit", applicantH.SubmitApplication)
		applicant.GET("/applications/:applicationID/status", applicantH.StatusDashboard)
	}

	// ---- Department Admin ----
	dept := r.Group("/dept", handlers.AuthRequired(), handlers.RequireRole("department_admin"))
	{
		dept.POST("/register", deptH.Register)
		dept.GET("/queue", deptH.Queue)
		dept.POST("/documents/:appDocID/approve", deptH.Approve)
		dept.POST("/documents/bulk-approve", deptH.BulkApprove)
		dept.POST("/documents/:appDocID/reject", deptH.Reject)
		dept.POST("/documents/:appDocID/reupload", deptH.Reupload)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("SWAGAT backend listening on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
