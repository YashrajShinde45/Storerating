import { useEffect, useState } from "react";

import SearchBar from "../../components/common/SearchBar";
import Loading from "../../components/common/Loading";

import StoreCard from "../../components/user/StoreCard";
import RatingModal from "../../components/user/RatingModal";

import {
  getStores,
  submitRating,
  updateRating,
} from "../../services/userService";

const UserDashboard = () => {
  const [stores, setStores] = useState(null);

  const [search, setSearch] = useState("");

  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    loadStores();
  }, [search]);

  const loadStores = async () => {
    const response = await getStores(search);

    setStores(response.data || []);
  };

  const saveRating = async (rating) => {
    if (selectedStore.user_rating) {
      await updateRating(selectedStore.id, rating);
    } else {
      await submitRating(selectedStore.id, rating);
    }

    setSelectedStore(null);

    loadStores();
  };

  if (!stores) return <Loading />;

  return (
    <>
      <h1>User Dashboard</h1>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search stores..."
      />

      <div className="store-grid">
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onRate={setSelectedStore}
          />
        ))}
      </div>

      {selectedStore && (
        <RatingModal
          store={selectedStore}
          onSubmit={saveRating}
          onClose={() => setSelectedStore(null)}
        />
      )}
    </>
  );
};

export default UserDashboard;
