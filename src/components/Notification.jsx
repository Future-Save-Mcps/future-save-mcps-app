"use client";

import { useState } from "react";
import { Bell, CreditCard, PiggyBank, CheckCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApiPatch } from "@/hooks/useApi";
import { Button } from "./ui/button";

function getTimeAgo(dateTime) {
  const now = new Date();
  const notificationDate = new Date(dateTime);
  const diffInMs = now.getTime() - notificationDate.getTime();

  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours}hr${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

function getNotificationIcon(type, title) {
  if (type === "Loan") {
    if (title.includes("deposited")) {
      return <CheckCircle className="h-5 w-5 text-white" />;
    }
    return <CreditCard className="h-5 w-5 text-white" />;
  }

  if (type === "Savings") {
    if (title.includes("plan")) {
      return <Target className="h-5 w-5 text-white" />;
    }
    return <PiggyBank className="h-5 w-5 text-white" />;
  }

  return <Bell className="h-5 w-5 text-white" />;
}

// function extractAmount(description) {
//   const match = description.match(/NGN\s?(\d{1,3}(?:,?\d{3})*(?:\.\d{2})?)/i);
//   return match
//     ? `₦ ${Number.parseInt(match[1].replace(/,/g, "")).toLocaleString()}.00`
//     : null;
// }

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  guarantorId,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to {action === "accept" ? "accept" : "reject"}{" "}
          this guarantor request?
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            disabled={loading}
            variant="outline"
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => onConfirm(guarantorId, action === "accept")}
            className={`px-4 py-2 ${
              action === "accept"
                ? "bg-blue-900 hover:bg-blue-800"
                : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            {loading
              ? "please wait..."
              : action === "accept"
              ? "Accept"
              : "Reject"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsComponent({ mockData, refetch }) {
  const { patch, isLoading: isLoadingPatch } = useApiPatch();

  const [notifications, setNotifications] = useState(
    [...mockData.data.items]
      .map((item) => ({ ...item, showFullDescription: false }))
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      )
  );
  const [filter, setFilter] = useState("All");
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    action: null,
    guarantorId: null,
  });

  const handleGuarantorAction = (guarantorId, action) => {
    setConfirmationModal({
      isOpen: true,
      action: action,
      guarantorId: guarantorId,
    });
  };

  const confirmGuarantorAction = async (guarantorId, isApproved) => {
    try {
      const result = await patch(
        `user/guarantor-approve-or-reject-loan?GuarantorId=${guarantorId}&IsApproved=${isApproved}`,
        undefined
      );

      if (result.success === true) {
        refetch();
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.guarantorId === guarantorId
              ? { ...notification, hasGuarantorApproved: isApproved }
              : notification
          )
        );
      }
      setConfirmationModal({ isOpen: false, action: null, guarantorId: null });
    } catch (error) {
      console.error("Error updating guarantor status:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    const result = await patch(
      `user/mark-notification-as-read?NotificationId=${notificationId}`,
      undefined,
      true
    );
    if (result.success === true) {
      refetch();
    }
    console.log(result);

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notificationId === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "Read") return notification.isRead;
    if (filter === "Unread") return !notification.isRead;
    return true; // "All"
  });

  return (
    <div className="  mx-auto bg-white ">
      {/* Filter Buttons */}
      <div className="flex mt-4 space-x-4 mb-6">
        {["All", "Read", "Unread"].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
              filter === option
                ? "bg-blue-900 text-white border-blue-900"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            // const amount = extractAmount(notification.description);

            return (
              <div
                key={notification.notificationId}
                className={`flex items-start rounded-lg ${
                  !notification.isRead ? "bg-[#e9f1fa]" : "bg-[#fff]"
                }  gap-3 p-4 border-b border-gray-100 relative cursor-pointer hover:bg-gray-50 transition-colors`}
                onClick={() => handleMarkAsRead(notification.notificationId)}
              >
                {!notification.isRead && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
                {/* Icon */}
                <div className=" flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                    {getNotificationIcon(
                      notification.notificationType,
                      notification.title
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "text-sm font-medium text-gray-900 leading-tight",
                      !notification.isRead ? "font-semibold" : "text-gray-600"
                    )}
                  >
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.showFullDescription ||
                    notification.description.length <= 30
                      ? notification.description
                      : `${notification.description.substring(0, 30)}...`}
                    {notification.description.length > 20 &&
                      !notification.showFullDescription && (
                        <span
                          className="text-[#7499cf] font-semibold cursor-pointer ml-1"
                          onClick={(e) => {
                            //   e.stopPropagation()
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.notificationId === notification.notificationId
                                  ? { ...n, showFullDescription: true }
                                  : n
                              )
                            );
                          }}
                        >
                          Read more
                        </span>
                      )}
                  </p>
                  {/* {notification.showFullDescription &&
                    notification.guarantorId?.trim() && (
                      <div className="flex gap-2  justify-end mt-2">
                        <Button disabled={notification.hasGuarantorApproved} className="text-white text-xs py-2 rounded-2xl h-fit disabled:bg-[#bcc6ff]">Accept</Button>
                        <Button disabled={notification.hasGuarantorApproved} className="text-white text-xs py-2 rounded-2xl h-fit bg-[#f55f5f] hover:bg-[#fca3a3]"> Decline</Button>
                      </div>
                    )} */}

                  {notification.showFullDescription &&
                    notification.guarantorId?.trim() && (
                      <div className="flex gap-2 justify-end mt-2">
                        <Button
                          disabled={
                            notification.hasGuarantorApproved || isLoadingPatch
                          }
                          className="text-white text-xs py-2 rounded-2xl h-fit disabled:bg-[#bcc6ff]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGuarantorAction(
                              notification.guarantorId,
                              "accept"
                            );
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          disabled={
                            notification.hasGuarantorApproved || isLoadingPatch
                          }
                          className="text-white text-xs py-2 rounded-2xl h-fit bg-[#f55f5f] hover:bg-[#fca3a3]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGuarantorAction(
                              notification.guarantorId,
                              "reject"
                            );
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeAgo(notification.dateTime)}
                  </p>
                </div>

                {/* Amount */}
                {/* {amount && (
                  <div className="flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-900">
                      {amount}
                    </span>
                  </div>
                )} */}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </div>
      <ConfirmationModal
        loading={isLoadingPatch}
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal({
            isOpen: false,
            action: null,
            guarantorId: null,
          })
        }
        onConfirm={confirmGuarantorAction}
        action={confirmationModal.action}
        guarantorId={confirmationModal.guarantorId}
      />
    </div>
  );
}
