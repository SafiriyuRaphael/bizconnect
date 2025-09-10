"use client";
import useNotification from "./hooks";
import Header from "./components/layout/Header";
import BulkActions from "./components/composites/BulkActions";
import Main from "./components/layout/Main";

const NotificationPage = () => {
  const {
    notificationParams,
    handleSelectNotification,
    handleSelectAll,
    selectedIds,
    handleParamsChange,
    handleDelete,
    handleUpdate,
    deleteMutation,
    updateMutation,
  } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        handleParamsChange={handleParamsChange}
        notificationParams={notificationParams}
      />
      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <BulkActions
          selectedIds={selectedIds}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />
      )}

      {/* Main Content */}
      <Main
        handleSelectAll={handleSelectAll}
        handleSelectNotification={handleSelectNotification}
        notificationParams={notificationParams}
        selectedIds={selectedIds}
      />
    </div>
  );
};

export default NotificationPage;
