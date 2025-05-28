import { useState } from "react";
import {
  formatDate,
  nameFormation,
} from "./CommentRowParentMessage";
import axiosInstance from "../../../services/axiosInstance";

const ReplyBlockAdmin = (props) => {
  const { parentId, repliesMessages, replyBoxShow, setReplyBoxShow, setOpenReplies, apiCallCommentAfterDeleteAndWritingComment } = props;
  const [replyCommentText, setReplyCommentText] = useState("");

  const handleShowReplyBox = () => {
    setReplyBoxShow(true);
  };

  const handleHideReplyBox = () => {
    if(repliesMessages?.length === 0){
      setReplyBoxShow(false);
      setOpenReplies(false);
    }
    else{
    setReplyBoxShow(false);
    }
  };

  const handleDeleteCommentAPI = async(commentId) => {
    try{
      await axiosInstance.delete(`/comments/`,{data : {comment_id:commentId}});
      await apiCallCommentAfterDeleteAndWritingComment();
      if(repliesMessages?.filter((item)=>item?.is_deleted === false)?.length === 0){
        setReplyBoxShow(false);
        setOpenReplies(false);
      }
      alert("Deleted Successfully");
    }
    catch(err){
       console.log(err,"Error delete comment");
    }
  }

  const handleReplyCommentAPI = async() => {
    try{
      await axiosInstance.post(`/comments/`,{
        parent_id: parentId,
        message: replyCommentText,
        sender_type: "admin"
      });
      await apiCallCommentAfterDeleteAndWritingComment();
      setReplyBoxShow(false);
      alert("Replied Successfully");
    }
    catch(err){
       console.log(err,"Error reply comment");
    }
  }

  return (
    <>
      {/* All Replies Block Admin Start Here */}

      {repliesMessages?.filter((item)=>item?.is_deleted === false)?.length > 0 &&
        repliesMessages?.filter((item)=>item?.is_deleted === false)?.map((replyItem, index) => {
          return (
            <tr>
              <td className="px-12 py-2 align-middle fw-600 bg-color-light-gray-shade">
                {replyItem?.sender_type === "admin"
                  ? "Administrator"
                  : nameFormation(replyItem?.user)}
              </td>
              <td className="px-12 py-2 align-middle bg-color-light-gray-shade">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    {replyItem?.message}
                    <p className="fs-12 fw-600 mb-0">{formatDate(replyItem?.timestamp)}</p>
                  </div>
                  <button
                    type="button"
                    className="btn p-0 border-0 bg-transparent"
                    onClick={()=>handleDeleteCommentAPI(replyItem?.id)}
                  >
                    <img
                      src="/assets/images/delete-icon-disabled.svg"
                      alt="delete-icon-disabled"
                      className="w-16"
                    />
                  </button>
                </div>
                {!replyBoxShow && index === repliesMessages?.length - 1 && (
                  <button
                    type="button"
                    className="btn p-0 fs-12 fw-600 text-color-draft border-none bg-transparent d-flex align-items-center"
                    onClick={handleShowReplyBox}
                  >
                    <img
                      src="/assets/images/reply-icon.svg"
                      alt="reply-icon"
                      className="me-6"
                    />
                    Reply
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      {replyBoxShow && (
        <tr>
          <td className="px-12 py-2 align-middle bg-color-light-gray-shade"></td>
          <td
            className="px-12 py-2 pe-0 align-middle bg-color-light-gray-shade border-end-0"
            colSpan={3}
          >
            <textarea
              className="form-control px-12 py-2 border-color-typo-secondary"
              placeholder="Type your Reply here.."
              id="replyCommentTextareaAdmin"
              style={{ height: "82px" }}
              value={replyCommentText}
              onChange={(e)=>setReplyCommentText(e.target.value)}
            ></textarea>
          </td>
          <td
            className="px-12 py-2 align-middle bg-color-light-gray-shade border-start-0"
            colSpan={2}
          >
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn p-0 fs-14 fw-600 text-color-draft border-none bg-transparent d-flex align-items-center me-3"
                onClick={handleReplyCommentAPI}
              >
                <img
                  src="/assets/images/send-reply-admin-icon.svg"
                  alt="send-reply-admin-icon"
                  className="me-1"
                />
                Send
              </button>
              <button
                type="button"
                className="btn p-0 fs-14 fw-600 text-color-responce-pending border-none bg-transparent d-flex align-items-center"
                onClick={handleHideReplyBox}
              >
                <img
                  src="/assets/images/close-icon-red-new.svg"
                  alt="close-icon-red-new"
                  className="me-1"
                />
                Cancel
              </button>
            </div>
          </td>
        </tr>
      )}
      {/* All Replies Block Admin End Here */}
    </>
  );
};

export default ReplyBlockAdmin;
