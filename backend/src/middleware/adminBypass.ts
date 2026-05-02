import { Request, Response, NextFunction } from 'express';

/**
 * Admin bypass middleware.
 * If `process.env.ADMIN_BYPASS_SECRET` is set and the request contains
 * header `x-admin-bypass: <secret>` and a query `asUser=<userId>`, this
 * middleware will set `req.params.userId = asUser` so routes that depend
 * on the :userId param will operate as that user.
 *
 * WARNING: This is a powerful backdoor intended for development/admin use only.
 * Protect the secret and do NOT enable in production without proper controls.
 */
export function adminBypass(req: Request, _res: Response, next: NextFunction) {
  try {
    if (process.env.NODE_ENV !== 'development') return next();

    const secret = process.env.ADMIN_BYPASS_SECRET;
    if (!secret) return next();

    const header = (req.header('x-admin-bypass') || req.header('X-Admin-Bypass')) as string | undefined;
    const asUser = (req.query.asUser || req.query.as_user) as string | undefined;

    if (header && header === secret && asUser) {
      // Ensure params object exists and set/override userId
      (req.params as any) = { ...(req.params || {}), userId: asUser };
      // Mark the request for auditing if needed
      (req as any).isAdminBypass = true;
    }
  } catch (err) {
    // swallow errors to avoid affecting normal requests
  }

  return next();
}
