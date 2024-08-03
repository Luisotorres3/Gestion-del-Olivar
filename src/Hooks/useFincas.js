import { useEffect, useState } from "react";
import { getFincas } from "../Utils/Firebase/databaseFunctions";

const useFincas = () => {
  const [fincas, setFincas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFincas = async () => {
      try {
        const data = await getFincas();
        setFincas(data.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchFincas();
  }, []);

  return { fincas, error };
};

export default useFincas;
