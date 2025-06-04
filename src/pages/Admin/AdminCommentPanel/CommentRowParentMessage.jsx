import { useEffect, useState } from "react";
import ReplyBlockAdmin from "./ReplyBlockAdmin";
import axiosInstance from "../../../services/axiosInstance";

export const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  // Format: DD Month, YYYY
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const withComma = formattedDate.replace(" ", ", ");
  return withComma;
};

export const nameFormation = (email) => {
  // Step 1: Get the part before '@'
  const username = email.split("@")[0];

  // Step 2: Replace '.' with space and capitalize each word
  const formattedName = username
    .split(".") // Split by '.'
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(" ");

  return formattedName;
};

export const getLatestTimestampFromSameSender = (messageObj) => {
  const outerSender = messageObj.sender_type;
  const outerTimestamp = new Date(messageObj.timestamp);

  const matchingReply = messageObj.replies?.find((reply) => {
    return (
      reply.sender_type === outerSender &&
      new Date(reply.timestamp) > outerTimestamp
    );
  });

  if (matchingReply) {
    return matchingReply.timestamp;
  }

  return messageObj.timestamp;
};

const CommentRowParentMessage = (props) => {
  const {
    parentMessage,
    apiCallCommentAfterDeleteAndWritingComment,
    parentComponentIdOpenedReply,
    setParentComponentIdOpenedReply,
  } = props;
  const [openReplies, setOpenReplies] = useState(false);
  const [replyBoxShow, setReplyBoxShow] = useState(false);

  useEffect(() => {
    if (parentComponentIdOpenedReply === parentMessage?.id) {
      setOpenReplies(true);
    } else {
      setOpenReplies(false);
    }
  }, [parentComponentIdOpenedReply]);

  const seenRequestAPI = async (ids) => {
    try {
      await axiosInstance.patch("/comments/", {
        comment_ids: ids,
      });
      apiCallCommentAfterDeleteAndWritingComment();
    } catch (err) {
      console.log(err, "Error while seen");
    }
  };

  const handleOpenReplies = () => {
    if (!openReplies) {
      if (parentMessage?.replies?.length === 0) {
        setReplyBoxShow(true);
      }
      setParentComponentIdOpenedReply(parentMessage?.id);
    } else {
      setReplyBoxShow(false);
      setParentComponentIdOpenedReply(null);
    }
    setOpenReplies(!openReplies);

    // Seen logic on replies

    // Step 1: Filter replies where is_deleted === false
    const activeReplies = parentMessage?.replies?.filter(
      (reply) => reply?.is_deleted === false,
    );

    // Step 2: Check if all those replies are admin_seen === true
    const allSeenByAdmin = activeReplies?.every(
      (reply) => reply?.admin_seen === true,
    );

    if (!allSeenByAdmin) {
      // Step 3: Get ids of vendor replies (filtered from active replies)
      const vendorReplyIds = activeReplies
        ?.filter((reply) => reply?.sender_type === "vendor")
        ?.map((reply) => reply?.id);

      // Step 4: Call PATCH API only if vendorReplyIds is not empty
      if (vendorReplyIds?.length > 0) {
        seenRequestAPI(vendorReplyIds);
      }
    }
  };

  return (
    <>
      <tr>
        <td className="px-12 py-2 align-middle fw-600 text-nowrap">
          {parentMessage?.sender_type === "admin" ? (
            <></>
          ) : parentMessage?.admin_seen === false ? (
            <span className="w-8 h-8 rounded-circle bg-color-draft d-inline-block me-10"></span>
          ) : (
            <></>
          )}
          {parentMessage?.sender_type === "admin"
            ? "Administrator"
            : nameFormation(parentMessage?.user)}
        </td>
        <td className="px-12 py-2 align-middle">
          {parentMessage?.message}
          <p className="fs-12 fw-600 mb-0">
            {formatDate(parentMessage?.timestamp)}
          </p>
        </td>
        <td className="px-12 py-2 align-middle text-end">
          {formatDate(getLatestTimestampFromSameSender(parentMessage))}
        </td>
        <td className="px-12 py-2 align-middle">
          {parentMessage?.pko_id}
          <p
            className="mb-0"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "110px",
            }}
          >{`(${parentMessage?.supplier_name})`}</p>
        </td>
        <td className="px-12 py-2 align-middle">
          {parentMessage?.sku_id ? parentMessage?.sku_id : "-"}
          {parentMessage?.sku_id ? (
            parentMessage?.component_name !== null ? (
              <p className="mb-0">{`(${parentMessage?.component_name})`}</p>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </td>
        <td className="px-12 py-2 align-middle">
          <button
            type="button"
            className="btn p-0 pe-35 border-none bg-transparent form-list position-relative"
            onClick={handleOpenReplies}
          >
            <div className="d-inline-block position-relative">
              <img
                src="/assets/images/replies-count-icon-admin.svg"
                alt="replies-count-icon-admin"
              />
              <span className="fs-12 fw-600 text-white position-absolute top-50 start-50 translate-middle pb-1">
                {parentMessage?.replies?.length}
              </span>
            </div>
          </button>
        </td>
      </tr>
      {openReplies && (
        <ReplyBlockAdmin
          parentId={parentMessage?.id}
          repliesMessages={parentMessage?.replies}
          replyBoxShow={replyBoxShow}
          setReplyBoxShow={setReplyBoxShow}
          setOpenReplies={setOpenReplies}
          apiCallCommentAfterDeleteAndWritingComment={
            apiCallCommentAfterDeleteAndWritingComment
          }
        />
      )}
    </>
  );
};

export default CommentRowParentMessage;
