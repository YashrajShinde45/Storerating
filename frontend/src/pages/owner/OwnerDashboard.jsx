import { useEffect, useState } from "react";

import Loading from "../../components/common/Loading";
import StatCard from "../../components/common/StatCard";
import DataTable from "../../components/common/DataTable";

import { getOwnerDashboard } from "../../services/ownerService";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const response = await getOwnerDashboard();

    setDashboard(response.data);
  };

  if (!dashboard) return <Loading />;

  const average =
    dashboard.stores && dashboard.stores.length > 0
      ? dashboard.stores[0].average_rating
      : "0";

  return (
    <>
      <h1>Store Owner Dashboard</h1>

      <StatCard
        title="Average Rating"
        value={average}
      />

      <h2>Users Who Rated Your Store</h2>

      <DataTable
        columns={[
          { key: "name", label: "User" },
          { key: "email", label: "Email" },
          { key: "rating", label: "Rating" },
        ]}
        data={dashboard.ratedUsers || []}
      />
    </>
  );
};

export default OwnerDashboard;
