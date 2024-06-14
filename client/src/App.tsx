import { useState } from "react";
import MenuItemForm from "./components/MenuItemForm";
import { MenuItem } from "./types/menu";
import MenuList from "./components/MenuList";

const App: React.FC = () => {
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);

  const handleSave = () => {
    setCurrentItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Restaurant Menu Management
      </h1>
      <MenuItemForm item={currentItem || undefined} onSave={handleSave} />
      <MenuList onEdit={handleEdit} />
    </div>
  );
};

export default App;
