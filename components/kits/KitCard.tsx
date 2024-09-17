"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { Monitor } from "lucide-react";

interface KitProps {
  kitID: number;
}

const KitCard = ({ kitID }: KitProps) => {
  const [kit, setKit] = useState<Kit | null>(null);

  const fetchKit = async () => {
    if (kitID !== 0) {
      try {
        const response = await api.get(`/kits/${kitID}/`);
        const kitData = response.data;
        setKit(kitData);
      } catch (error) {
        console.error(error);
      }
    } else {
      setKit(null);
    }
  };

  useEffect(() => {
    fetchKit();
  }, [kitID]);

  return (
    <div className="flex gap-3">
      <Monitor />
      <div>
        <strong>{kit ? kit.name : " "}</strong>
      </div>
    </div>
  );
};

export default KitCard;
