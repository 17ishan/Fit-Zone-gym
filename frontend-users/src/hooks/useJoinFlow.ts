import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

/** Where a signed-in member completes the purchase. */
const MEMBERSHIP_ROUTE = "/dashboard/membership";

/**
 * Shared "Join / become a member" action used by every Join CTA.
 * Buying requires an account, so signed-out visitors are sent to sign in /
 * sign up first and returned to the purchase page afterward.
 */
export function useJoinFlow(): () => void {
  const { user } = useAuth();
  const navigate = useNavigate();

  return useCallback(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(MEMBERSHIP_ROUTE)}`);
    } else {
      navigate(MEMBERSHIP_ROUTE);
    }
  }, [user, navigate]);
}
