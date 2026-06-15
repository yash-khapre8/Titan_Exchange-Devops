# ── VPC ───────────────────────────────────────────────────────────────────────
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc-${var.environment}"
  }
}

# ── Internet Gateway ──────────────────────────────────────────────────────────
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw-${var.environment}"
  }
}

# ── Public Subnets ────────────────────────────────────────────────────────────
resource "aws_subnet" "public" {
  count = 3

  vpc_id                  = aws_vpc.main.id
  cidr_block              = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"][count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name                                                                 = "${var.project_name}-public-${count.index + 1}-${var.environment}"
    "kubernetes.io/role/elb"                                             = "1"
    "kubernetes.io/cluster/${var.project_name}-${var.environment}"       = "shared"
  }
}

# ── Private Subnets ───────────────────────────────────────────────────────────
resource "aws_subnet" "private" {
  count = 3

  vpc_id            = aws_vpc.main.id
  cidr_block        = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"][count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name                                                                 = "${var.project_name}-private-${count.index + 1}-${var.environment}"
    "kubernetes.io/role/internal-elb"                                    = "1"
    "kubernetes.io/cluster/${var.project_name}-${var.environment}"       = "shared"
  }
}

# ── Elastic IP for NAT Gateway ────────────────────────────────────────────────
resource "aws_eip" "nat" {
  count  = var.enable_nat_gateway ? 1 : 0
  domain = "vpc"

  tags = {
    Name = "${var.project_name}-nat-eip-${var.environment}"
  }

  depends_on = [aws_internet_gateway.main]
}

# ── NAT Gateway (single AZ for cost optimisation) ─────────────────────────────
resource "aws_nat_gateway" "main" {
  count = var.enable_nat_gateway ? 1 : 0

  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "${var.project_name}-nat-${var.environment}"
  }

  depends_on = [aws_internet_gateway.main]
}

# ── Public Route Table ────────────────────────────────────────────────────────
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-rt-public-${var.environment}"
  }
}

resource "aws_route_table_association" "public" {
  count = 3

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# ── Private Route Table ───────────────────────────────────────────────────────
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  dynamic "route" {
    for_each = var.enable_nat_gateway ? [1] : []
    content {
      cidr_block     = "0.0.0.0/0"
      nat_gateway_id = aws_nat_gateway.main[0].id
    }
  }

  tags = {
    Name = "${var.project_name}-rt-private-${var.environment}"
  }
}

resource "aws_route_table_association" "private" {
  count = 3

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
