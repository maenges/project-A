export interface HealthCheckResult {
  status: string;
  errors: Array<{ name: string; status: string; description: string }>;
}
