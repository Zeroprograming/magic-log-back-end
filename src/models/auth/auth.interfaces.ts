interface jwtPayload {
  id: string;
  email: string;
  sub: string;
  iat?: number;
  exp?: number;
}

export type { jwtPayload };
