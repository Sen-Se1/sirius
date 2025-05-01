"use client";

import { useEffect } from "react";
import { useOrganizationList } from "@clerk/nextjs";

export const OrgControl = ({ orgId }: { orgId: string }) => {
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;
    setActive({
      organization: orgId,
    });
  }, [setActive, orgId]);

  return null;
};