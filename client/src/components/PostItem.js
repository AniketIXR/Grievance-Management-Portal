import React, { useContext, useState } from "react";
import "../styles/postItem.css";
import "../styles/Card.css";
import timeDifferenceForDate from "../utils/timeDifferenceForDate";
import postContext from "../context/post/postContext";
import { HOST } from "../constants";
import axios from "axios";
import alertContext from "../context/alert/alertContext";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import PostCard from "./PostCard";
import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';

const PostItem = (props) => {

  const contextPost = useContext(postContext);
  const { deletePost, changeStatus } = contextPost;

  const contextAlert = useContext(alertContext);
  const { showAlert } = contextAlert;

  const [upvoted, setUpvoted] = useState(
    props.post.upvoters.includes(localStorage.getItem("loggedInUserId"))
  );
  const [downvoted, setDownvoted] = useState(
    props.post.downvoters.includes(localStorage.getItem("loggedInUserId"))
  );
  const [upvoteCount, setUpvoteCount] = useState(props.post.upvoteCount);
  const [downvoteCount, setDownvoteCount] = useState(props.post.downvoteCount);
  const [disableVoting, setDisableVoting] = useState(false);
  const [status, setStatus] = useState(props.post.status);
  const [requestedChange, setRequestedChange] = useState(false);

  const badgeText = () => {
    if(status===0)
      return "Just Dropped"
    else if(status===1)
      return "Mission Accomplished"
    else
      return "Approved"
  }

  const badgeColor = () => {
    if(status===0)
      return "danger"
    else if(status===1)
      return "warning"
    else
      return "success"
  }

  const handleUpvote = async (e) => {
    e.preventDefault();
    if(disableVoting===true) {
      return;
    }
    setDisableVoting(true);
    const ENDPOINT = `/api/v1/posts/${props.post._id}/upvote`;
    const UPVOTE_POST_ENDPOINT = `${HOST}${ENDPOINT}`;
    try {
      const response = await axios.patch(
        UPVOTE_POST_ENDPOINT,
        {},
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      if (response.status === 201) {
        if (response.data.message === "addedUpvote") {
          setUpvoted(true);
          setUpvoteCount(upvoteCount + 1);
          if (downvoted) {
            setDownvoted(false);
            setDownvoteCount(downvoteCount - 1);
          }
        } else {
          setUpvoted(false);
          setUpvoteCount(upvoteCount - 1);
        }
      } else {
        console.log("failed to upvote post, post might be deleted?");
        showAlert("danger", "Failed to upvote, post might be deleted!");
      }
    } catch (error) {
      console.error(error);
      showAlert("danger", "Something went wrong");
    }
    setDisableVoting(false);
  };

  const handleDownvote = async (e) => {
    e.preventDefault();
    if(disableVoting===true) {
      return;
    }
    setDisableVoting(true);
    const ENDPOINT = `/api/v1/posts/${props.post._id}/downvote`;
    const DOWNVOTE_POST_ENDPOINT = `${HOST}${ENDPOINT}`;
    try {
      const response = await axios.patch(
        DOWNVOTE_POST_ENDPOINT,
        {},
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      if (response.status === 201) {
        if (response.data.message === "addedDownvote") {
          setDownvoted(true);
          setDownvoteCount(downvoteCount + 1);
          if (upvoted) {
            setUpvoted(false);
            setUpvoteCount(upvoteCount - 1);
          }
        } else {
          setDownvoted(false);
          setDownvoteCount(downvoteCount - 1);
        }
      } else {
        console.log("failed to downvote post, post might be deleted?");
        showAlert("danger", "Failed to downvote, post might be deleted!");
      }
    } catch (error) {
      console.error(error);
      showAlert("danger", "Something went wrong");
    }
    setDisableVoting(false);
  };

  const handleDeletePost = (e) => {
    e.preventDefault();
    deletePost(props.post._id);
  };

  const handleStatusChange = (e) =>{
    e.preventDefault();
    const USER_ROLE = localStorage.getItem("role");
    const USER_ID = localStorage.getItem("loggedInUserId");
    if(requestedChange===true)
      return;
    if(USER_ROLE==="user" && props.post.user._id!==USER_ID)
      return;
    if(USER_ROLE==="user" && status===2)
      return;
    if(USER_ROLE==="admin" && status!==0)
      return;
    if(USER_ROLE==="admin")
      setStatus(1); //For feedback, that status will be changed to this
    if(USER_ROLE==="user")
      setStatus(2);
    setRequestedChange(true);
    return;
  }

  const handleCancelStatusChange = (e) => {
    e.preventDefault();
    setStatus(props.post.status);
    setRequestedChange(false);
  }

  const handleSubmitStatusChange = async(e) => {
    e.preventDefault();
    
    const result = await changeStatus(props.post._id);
    if(result===false)
      setStatus(props.post.state);
    setRequestedChange(false);
  }

  
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
      }}
    >
      {/* Image and content */}
      <AspectRatio ratio="1" sx={{ width: 400 }}>
          <img
          src={props.post.images[0]}
          loading="lazy"
          alt="postLogo"
        />
      </AspectRatio>
      <CardContent>
        {/* Post author and heading */}
        <Typography level="title-lg" id="card-description">
          <div className="row">
              <div className="col-2">
                <img
                  src={props.post.user.photo}
                  alt="UserLogo"
                  className="circle_img"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span></span>
              <div className="col-10">
                <h6 className="d-inline">{props.post.user.name}</h6>
                <br />
                <small>
                {props.post.heading}
                </small>
              </div>
          </div>
        </Typography>
        {/* Post date */}
        <span></span>
        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: 'none' }}
        >
          {new Date(props.post.createdAt).toLocaleString("ear-MA", {
                    weekday: "long",
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  })}
        </Chip>
        {/* Upvote/downvote */}
        <div className="d-flex justify-content-between">
            <div>
              <i
                className={upvoted?"bi bi-cloud-check-fill": "bi bi-cloud-arrow-up"}
                style={{ color: upvoted ? "green" : "grey", cursor: "pointer" }}
                onClick={handleUpvote}
              ></i>{" "}
              {upvoteCount}
              
            </div>
            {/* Delete post (if user is author) */}
            {localStorage.getItem("loggedInUserId") === props.post.user._id && (
              <i
                className="bi bi-trash"
                style={{ color: "#a30505", cursor: "pointer" }}
                onClick={handleDeletePost}
              ></i>
            )}
          </div>
        {/* Post body */}
        <Typography level="body-sm" aria-describedby="card-description" mb={1}>
            {props.post.body}
        </Typography>
        {/* End of content */}
         {/* Comment button */}
         <Link style={{cursor: "pointer", zIndex:'2'}} onClick={() => {window.location=`/postdetails/${props.post._id}`}}>
          Add Comment
        </Link>
        <button
  // className={`btn position-absolute top-30 start-40 translate-left badge bg-${badgeColor()}`}
  className={`btn position-relative bottom-2 start-40 translate-left badge bg-${badgeColor()}`}

  style={{ zIndex: 1, cursor: "pointer", marginBottom: "10px",width: "150px" }}
  onClick={handleStatusChange}
>
  {badgeText()}
</button>
{requestedChange && (
          <div>
            <span className="position-relative top-0 start-0 translate-end badge bg-success" style={{zIndex: "2", cursor: "pointer" ,marginRight: "10px" }} onClick={handleSubmitStatusChange}>confirm</span>
           
            <span className="position-relative top-0 start-0 translate-start badge  bg-danger" style={{zIndex: "1", cursor: "pointer" }} onClick={handleCancelStatusChange}>cancel</span>  
            <br/>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostItem;
