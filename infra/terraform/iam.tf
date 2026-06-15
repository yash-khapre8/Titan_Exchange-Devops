# ────────────────────────────────────────────────────────────────────────────
# IAM – EKS Cluster Role
# ────────────────────────────────────────────────────────────────────────────
resource "aws_iam_role" "eks_cluster" {
  name = "${var.project_name}-eks-cluster-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
    }]
  })

  tags = { Name = "${var.project_name}-eks-cluster-role" }
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  role       = aws_iam_role.eks_cluster.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# ────────────────────────────────────────────────────────────────────────────
# IAM – EKS Node Role
# ────────────────────────────────────────────────────────────────────────────
resource "aws_iam_role" "eks_node" {
  name = "${var.project_name}-eks-node-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })

  tags = { Name = "${var.project_name}-eks-node-role" }
}

resource "aws_iam_role_policy_attachment" "eks_worker_node" {
  role       = aws_iam_role.eks_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "eks_cni" {
  role       = aws_iam_role.eks_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "eks_ecr_readonly" {
  role       = aws_iam_role.eks_node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "eks_cloudwatch" {
  role       = aws_iam_role.eks_node.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# ────────────────────────────────────────────────────────────────────────────
# IAM – EBS CSI Driver Role (IRSA)
# ────────────────────────────────────────────────────────────────────────────
resource "aws_iam_role" "ebs_csi" {
  name = "${var.project_name}-ebs-csi-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRoleWithWebIdentity"
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks.arn
      }
      Condition = {
        StringEquals = {
          "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub" = "system:serviceaccount:kube-system:ebs-csi-controller-sa"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ebs_csi" {
  role       = aws_iam_role.ebs_csi.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
}

# ────────────────────────────────────────────────────────────────────────────
# IAM – Backend App Role (IRSA)
# ────────────────────────────────────────────────────────────────────────────
resource "aws_iam_role" "backend_app" {
  name = "${var.project_name}-backend-app-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRoleWithWebIdentity"
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.eks.arn
      }
      Condition = {
        StringEquals = {
          "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub" = "system:serviceaccount:titan-exchange:titan-backend-sa"
          "${replace(aws_iam_openid_connect_provider.eks.url, "https://", "")}:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })

  tags = { Name = "${var.project_name}-backend-app-role" }
}

# ── DynamoDB policy ───────────────────────────────────────────────────────────
resource "aws_iam_policy" "dynamodb_access" {
  name        = "${var.project_name}-dynamodb-policy-${var.environment}"
  description = "Grants backend app CRUD access to titan_* DynamoDB tables"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDBTableAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchGetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:TransactWriteItems",
          "dynamodb:ConditionCheckItem",
        ]
        Resource = [
          "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/titan_*",
          "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/titan_*/index/*",
        ]
      },
      {
        Sid    = "DynamoDBDescribe"
        Effect = "Allow"
        Action = ["dynamodb:DescribeTable", "dynamodb:ListTables"]
        Resource = ["*"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "backend_dynamodb" {
  role       = aws_iam_role.backend_app.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

# ── Cognito policy ────────────────────────────────────────────────────────────
resource "aws_iam_policy" "cognito_access" {
  name        = "${var.project_name}-cognito-policy-${var.environment}"
  description = "Grants backend app Cognito user management permissions"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "CognitoAccess"
      Effect = "Allow"
      Action = [
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminSetUserPassword",
        "cognito-idp:AdminUpdateUserAttributes",
        "cognito-idp:AdminDisableUser",
        "cognito-idp:AdminEnableUser",
        "cognito-idp:AdminDeleteUser",
        "cognito-idp:AdminAddUserToGroup",
        "cognito-idp:AdminRemoveUserFromGroup",
        "cognito-idp:AdminListGroupsForUser",
        "cognito-idp:ListUsers",
      ]
      Resource = [aws_cognito_user_pool.main.arn]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "backend_cognito" {
  role       = aws_iam_role.backend_app.name
  policy_arn = aws_iam_policy.cognito_access.arn
}

# ── Backend Service Account (K8s annotation set via kubectl/helm) ─────────────
resource "aws_iam_instance_profile" "backend" {
  name = "${var.project_name}-backend-instance-profile"
  role = aws_iam_role.backend_app.name
}
