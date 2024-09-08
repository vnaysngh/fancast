import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context";
import { useNavigate } from "react-router-dom";

type TokenGateProps = {
  children: React.ReactNode;
};

export const TokenGate: React.FC<TokenGateProps> = ({ children }) => {
  const { address, getAttestation, userInfo } = useStateContext();
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAttestation = async () => {
      const response = await getAttestation(userInfo.data?.attestationId);
      if (response.data) {
        if (response.data?.owner?.toLowerCase() === address.toLowerCase()) {
          setAuthorized(true);
        }
        setLoading(false);
      }
    };

    if (address && userInfo.data?.attestationId) {
      verifyAttestation();
    }
  }, [address, userInfo]);

  if (!address) return <div>User needs to connect the wallet</div>;

  if (!userInfo.data?.attestationId) return <div>User is not authorized</div>;

  if (loading) return <div>Authenticating. Please wait...</div>;

  if (!authorized && !loading) {
    navigate("/");
  }

  if (authorized && !loading) return children;
};
