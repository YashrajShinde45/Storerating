import { useEffect, useState } from "react";

import StatCard from "../../components/common/StatCard";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/common/DataTable";
import Loading from "../../components/common/Loading";

import AddUserModal from "../../components/admin/AddUserModal";
import AddStoreModal from "../../components/admin/AddStoreModal";
import UserDetailsModal from "../../components/admin/UserDetailsModal";

import {
  getDashboard,
  getUsers,
  getUserDetails,
  addUser,
  getStores,
  addStore,
} from "../../services/adminService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("ASC");

  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleAddUser = async (userData) => {
    await addUser(userData);
    loadDashboard();
    loadUsers();
  };

  const handleAddStore = async (storeData) => {
    await addStore(storeData);
    loadDashboard();
    loadStores();
  };

  const handleViewUser = async (userId) => {
    const response = await getUserDetails(userId);
    if (response.data) {
      setSelectedUser(response.data);
    }
  };

  if (!dashboard) return <Loading />;

  const ownerUsers = users.filter((u) => u.role === "owner");

  return (
    <>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <div className="action-buttons">
          <button
            type="button"
            className="primary-btn"
            onClick={() => setShowAddUser(true)}
          >
            + Add User
          </button>
          <button
            type="button"
            className="primary-btn accent-btn"
            onClick={() => setShowAddStore(true)}
          >
            + Add Store
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Users" value={dashboard.users ?? dashboard.totalUsers} />
        <StatCard title="Total Stores" value={dashboard.stores ?? dashboard.totalStores} />
        <StatCard title="Total Ratings" value={dashboard.ratings ?? dashboard.totalRatings} />
      </div>

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search users or stores by name/email/address..."
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="owner">Store Owner</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="address">Sort by Address</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="ASC">Ascending (A-Z)</option>
          <option value="DESC">Descending (Z-A)</option>
        </select>
      </div>

      <h2>Users List</h2>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          {
            key: "role",
            label: "Role",
            render: (row) => (
              <span className={`role-badge role-${row.role}`}>{row.role}</span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <button
                type="button"
                className="secondary-btn btn-sm"
                onClick={() => handleViewUser(row.id)}
              >
                View Details
              </button>
            ),
          },
        ]}
        data={users}
      />

      <h2>Stores List</h2>

      <DataTable
        columns={[
          { key: "name", label: "Store Name" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address" },
          {
            key: "owner_name",
            label: "Owner",
            render: (row) => row.owner_name || `Owner #${row.owner_id}`,
          },
          {
            key: "rating",
            label: "Rating",
            render: (row) => (row.rating ? `${row.rating} ★` : "0 ★"),
          },
        ]}
        data={stores}
      />

      {showAddUser && (
        <AddUserModal
          onSubmit={handleAddUser}
          onClose={() => setShowAddUser(false)}
        />
      )}

      {showAddStore && (
        <AddStoreModal
          owners={ownerUsers}
          onSubmit={handleAddStore}
          onClose={() => setShowAddStore(false)}
        />
      )}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};

export default AdminDashboard;
