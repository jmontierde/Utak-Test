import React, { useEffect, useState } from "react";
import { MenuItem } from "../types/menu";
import { database } from "../firebaseConfig";
import { ref, onValue, remove, set } from "firebase/database";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridRowId,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";

const MenuList: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    const menuItemsRef = ref(database, "menuItems");
    onValue(menuItemsRef, (snapshot) => {
      const items = snapshot.val();
      const itemList: MenuItem[] = [];
      if (items) {
        Object.entries(items).forEach(([id, item]) => {
          itemList.push({ id, ...(item as MenuItem) });
        });
      }
      setMenuItems(itemList);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await remove(ref(database, `menuItems/${id}`));
  };

  const handleEditClick = (id: GridRowId) => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = async (id: GridRowId) => {
    const updatedItem = menuItems.find((item) => item.id === id);
    if (updatedItem) {
      await set(ref(database, `menuItems/${id}`), updatedItem);
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const processRowUpdate = async (newRow: MenuItem) => {
    const updatedItems = menuItems.map((item) =>
      item.id === newRow.id ? { ...item, ...newRow } : item
    );
    setMenuItems(updatedItems);

    await set(ref(database, `menuItems/${newRow.id}`), newRow);
    return newRow;
  };

  const columns: GridColDef[] = [
    { field: "index", headerName: "Index", flex: 1 },
    { field: "category", headerName: "Category", flex: 1, editable: true },
    { field: "name", headerName: "Name", flex: 1, editable: true },
    { field: "options", headerName: "Options", flex: 1, editable: true },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 1,
      editable: true,
    },
    {
      field: "cost",
      headerName: "Cost",
      type: "number",
      flex: 1,
      editable: true,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;
        return isInEditMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSaveClick(params.id)}
            style={{ marginRight: 10 }}
          >
            Save
          </Button>
        ) : (
          <div className="space-x-3">
            <Button
              sx={{
                color: "#ffffff", // Text color
                backgroundColor: "#25AE9C", // Background color
                "&:hover": {
                  backgroundColor: "#17a2b8", // Hover background color
                },
              }}
              onClick={() => handleEditClick(params.id)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                color: "#ffffff", // Text color
                backgroundColor: "#AD2437", // Background color
                "&:hover": {
                  backgroundColor: "#A20000", // Hover background color
                },
              }}
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = menuItems.map((item, index) => ({
    ...item,
    index: index + 1,
    options: Array.isArray(item.options)
      ? item.options.join(", ")
      : item.options || "None",
  }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <h2 className="text-lg font-semibold">Items</h2>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        autoHeight
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        processRowUpdate={processRowUpdate}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
      />
    </div>
  );
};

export default MenuList;
