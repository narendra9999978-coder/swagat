package models

import "time"

type Role string

const (
	RoleSuperAdmin      Role = "super_admin"
	RoleDepartmentAdmin Role = "department_admin"
	RoleApplicant       Role = "applicant"
)

type User struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Role     Role   `json:"role"`
}

type Department struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	SLAHours int    `json:"sla_hours"`
}

type BusinessType struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type TreeType string

const (
	TreeTypeBusiness TreeType = "business"
	TreeTypeOrg      TreeType = "org"
)

type Step string

const (
	StepBusinessRegistration Step = "business_registration"
	StepBusinessActivity     Step = "business_activity"
	StepForeignInvestment    Step = "foreign_investment"
	StepProjectLand          Step = "project_land"
)

var AllSteps = []Step{StepBusinessRegistration, StepBusinessActivity, StepForeignInvestment, StepProjectLand}

type NodeType string

const (
	NodeTypeQuestion NodeType = "question"
	NodeTypeOption   NodeType = "option"
)

type TreeNode struct {
	ID             string   `json:"id"`
	TreeType       TreeType `json:"tree_type"`
	BusinessTypeID *string  `json:"business_type_id,omitempty"`
	Step           *Step    `json:"step,omitempty"`
	DepartmentID   *string  `json:"department_id,omitempty"`
	ParentID       *string  `json:"parent_id,omitempty"`
	NodeType       NodeType `json:"node_type"`
	Label          string   `json:"label"`
	IsLeaf         bool     `json:"is_leaf"`
	SortOrder      int      `json:"sort_order"`
}

type DocumentType struct {
	ID                 string  `json:"id"`
	Name               string  `json:"name"`
	OwningDepartmentID string  `json:"owning_department_id"`
	ValidityDays       *int    `json:"validity_days,omitempty"`
	TemplateFileURL    *string `json:"template_file_url,omitempty"`
}

type LeafDocument struct {
	ID             string  `json:"id"`
	LeafNodeID     string  `json:"leaf_node_id"`
	DocumentTypeID string  `json:"document_type_id"`
	IsMandatory    bool    `json:"is_mandatory"`
	DependsOn      *string `json:"depends_on,omitempty"`

	// convenience fields joined in for API responses
	DocumentName       string `json:"document_name,omitempty"`
	OwningDepartmentID string `json:"owning_department_id,omitempty"`
}

type Applicant struct {
	ID         string `json:"id"`
	UserID     string `json:"user_id"`
	PAN        string `json:"pan,omitempty"`
	EntityName string `json:"entity_name,omitempty"`
}

type ApplicationStatus string

const (
	AppStatusInProgress ApplicationStatus = "in_progress"
	AppStatusSubmitted  ApplicationStatus = "submitted"
	AppStatusDispatched ApplicationStatus = "dispatched"
	AppStatusCompleted  ApplicationStatus = "completed"
)

type Application struct {
	ID             string            `json:"id"`
	ApplicantID    string            `json:"applicant_id"`
	BusinessTypeID string            `json:"business_type_id"`
	Status         ApplicationStatus `json:"status"`
	CreatedAt      time.Time         `json:"created_at"`
	SubmittedAt    *time.Time        `json:"submitted_at,omitempty"`
}

type DocStatus string

const (
	DocPendingReview     DocStatus = "pending_review"
	DocApproved          DocStatus = "approved"
	DocRejected          DocStatus = "rejected"
	DocExpired           DocStatus = "expired"
	DocWaitingDependency DocStatus = "waiting_on_dependency"
)

type ApplicationDocument struct {
	ID              string     `json:"id"`
	ApplicationID   string     `json:"application_id"`
	LeafDocumentID  string     `json:"leaf_document_id"`
	DocumentTypeID  string     `json:"document_type_id"`
	DocumentName    string     `json:"document_name,omitempty"`
	VaultEntryID    *string    `json:"vault_entry_id,omitempty"`
	FileURL         *string    `json:"file_url,omitempty"`
	Status          DocStatus  `json:"status"`
	ReusedFromVault bool       `json:"reused_from_vault"`
	BundleID        *string    `json:"bundle_id,omitempty"`
	ReviewedAt      *time.Time `json:"reviewed_at,omitempty"`
	ExpiryDate      *time.Time `json:"expiry_date,omitempty"`
	RejectionReason *string    `json:"rejection_reason,omitempty"`
}

type BundleStatus string

const (
	BundlePending        BundleStatus = "pending"
	BundleInReview       BundleStatus = "in_review"
	BundleApproved       BundleStatus = "approved"
	BundleDeemedApproved BundleStatus = "deemed_approved"
	BundleBreached       BundleStatus = "breached"
)

type DocumentBundle struct {
	ID              string       `json:"id"`
	ApplicationID   string       `json:"application_id"`
	DepartmentID    string       `json:"department_id"`
	DepartmentName  string       `json:"department_name,omitempty"`
	AssignedAdminID *string      `json:"assigned_admin_id,omitempty"`
	Status          BundleStatus `json:"status"`
	ReassignedCount int          `json:"reassigned_count"`
	DispatchedAt    *time.Time   `json:"dispatched_at,omitempty"`
	SLADeadline     *time.Time   `json:"sla_deadline,omitempty"`
	CompletedAt     *time.Time   `json:"completed_at,omitempty"`
}

type AdminRegistration struct {
	ID           string `json:"id"`
	UserID       string `json:"user_id"`
	DepartmentID string `json:"department_id"`
	OrgNodeID    string `json:"org_node_id"`
}
