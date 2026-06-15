variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Deployment environment (production, staging, development)"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["production", "staging", "development"], var.environment)
    error_message = "Environment must be one of: production, staging, development."
  }
}

variable "project_name" {
  description = "Project name used as prefix for all resources"
  type        = string
  default     = "titan-exchange"
}

variable "eks_node_instance_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "eks_min_nodes" {
  description = "Minimum number of EKS worker nodes"
  type        = number
  default     = 2
}

variable "eks_max_nodes" {
  description = "Maximum number of EKS worker nodes"
  type        = number
  default     = 10
}

variable "eks_desired_nodes" {
  description = "Desired number of EKS worker nodes"
  type        = number
  default     = 3
}

variable "eks_kubernetes_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.29"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_nat_gateway" {
  description = "Whether to enable a NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "cognito_domain_prefix" {
  description = "Unique prefix for the Cognito hosted UI domain"
  type        = string
  default     = "titan-exchange-auth"
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
