import { useEffect, useState } from "react";

import StatCard from "../../components/common/StatCard";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/common/DataTable";
import Loading from "../../components/common/Loading";

import {
  getDashboard,
  getUsers,
  getStores,
} from "../../services/adminService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("ASC");

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadUsers();
    loadStores();
  }, [search, role, sort, order]);

  const loadDashboard = async () => {
    const response = await getDashboard();
    setDashboard(response.data);
  };

  const loadUsers = async () => {
    const response = await getUsers(search, role, sort, order);
    setUsers(response.data || []);
  };

  const loadStores = async () => {
    const response = await getStores(search, sort, order);
    setStores(response.data || []);
  };

  if (!dashboard) return <Loading />;

  return (
    <>
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <StatCard title="Users" value={dashboard.totalUsers ?? dashboard.users} />
        <StatCard title="Stores" value={dashboard.totalStores ?? dashboard.stores} />
        <StatCard title="Ratings" value={dashboard.totalRatings ?? dashboard.ratings} />
      </div>

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search users or stores..."
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="owner">Store Owner</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="address">Sort by Address</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>

      <h2>Users</h2>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
        ]}
        data={users}
      />

      <h2>Stores</h2>

      <DataTable
        columns={[
          { key: "name", label: "Store" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          { key: "rating", label: "Rating" },
        ]}
        data={stores}
      />
    </>
  );
};

export default AdminDashboard;
