terraform {
  required_version = "~> 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
  }

  # Remote state backend — configure bucket name before running
  backend "s3" {
    bucket         = "titan-exchange-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "titan-exchange-terraform-locks"
  }
}

# ── AWS Provider ──────────────────────────────────────────────────────────────
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      {
        Project     = var.project_name
        Environment = var.environment
        ManagedBy   = "Terraform"
        Owner       = "TitanExchange-DevOps"
      },
      var.tags
    )
  }
}

# ── Random suffix for globally unique names ───────────────────────────────────
resource "random_id" "suffix" {
  byte_length = 4
}

# ── Data sources ──────────────────────────────────────────────────────────────
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}
