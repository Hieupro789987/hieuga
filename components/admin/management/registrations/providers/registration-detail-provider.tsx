import { createContext, useContext } from "react";
import { useGetOneById } from "../../../../../lib/hooks/useGetOneById";
import {
  ShopRegistration,
  ShopRegistrationService,
} from "../../../../../lib/repo/shop-registration.repo";
export const RegistrationDetailContext = createContext<
  Partial<{
    registration: ShopRegistration;
    setRegistration: (registration: Partial<ShopRegistration>) => void;
  }>
>({});

type RegistrationProviderProps = ReactProps & {
  id: string;
};

export function RegistrationDetailProvider(props: RegistrationProviderProps) {
  const { id } = props;
  const [registration, setRegistration] = useGetOneById(id, ShopRegistrationService);

  return (
    <RegistrationDetailContext.Provider
      value={{
        registration,
        setRegistration,
      }}
    >
      {props.children}
    </RegistrationDetailContext.Provider>
  );
}

export const useRegistrationDetailContext = () => useContext(RegistrationDetailContext);
