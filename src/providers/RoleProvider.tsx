"use client";

import { createContext, useContext, ReactNode } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";

interface RoleContextType {
  roles: string[];
  isLoading: boolean;
  isError: boolean;
}

const RoleContext = createContext<RoleContextType>({
  roles: [],
  isLoading: true,
  isError: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  const shouldFetch = status === "authenticated";

  const { data, error, isValidating } = useSWR(
    shouldFetch ? "/api/auth/roles" : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      refreshInterval: 0, // Set to e.g. 30000 to poll every 30 seconds if needed
    }
  );

  return (
    <RoleContext.Provider
      value={{
        roles: data?.roles || [],
        isLoading: status === "loading" || (isValidating && shouldFetch && !data),
        isError: !!error,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => useContext(RoleContext);
