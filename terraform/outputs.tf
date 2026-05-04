output "public_ip" {
  value = aws_instance.devops_server.public_ip
}

output "ssh_command" {
  value = "ssh -i ${var.key_name}.pem ubuntu@${aws_instance.devops_server.public_ip}"
}