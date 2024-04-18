import React, { useContext, useState } from "react";
import "../styles/Complaint.css";
import "../styles/Card.css";
import postContext from "../context/post/postContext";
import { HOST } from "../backend";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import ComplaintModal from "./ComplaintModal";
import { toast } from 'react-toastify';

const Complaint = (props) => {

  const contextPost = useContext(postContext);
  const { deletePost, changeStatus } = contextPost;

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

  const[showDetails, setShowDetails] = useState(false);
  
  const changeShowDetails = () => {
    setShowDetails(!showDetails);
  }

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
        toast.error("Failed to upvote, post might be deleted!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
    setDisableVoting(false);
  };

  const handleDeletePost = (e) => {
    e.preventDefault();
    deletePost(props.post._id);
  };

  const handleStatusChange = async (e) =>{
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
    const result = await changeStatus(props.post._id);
    if(result===false)
      setStatus(props.post.state);
    setRequestedChange(false);
    return;
  }
  
  return (
    <>
      <Card
        variant="outlined"
        orientation="horizontal"
        sx={{
          backgroundColor: '#fff', '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder'}
        }}
      >
        <AspectRatio ratio="1" sx={{ width: 400 }}>
            <img
            src={props.post.images[0]}
            loading="lazy"
            alt="postLogo"
          />
        </AspectRatio>
        <CardContent>
          <Typography level="title-lg" id="card-description">
            <div className="row">
                <div><div className="col-2">
                  <img
                    src={props.post.user.photo}
                    alt="UserLogo"
                    className="circle_img"
                    referrerPolicy="no-referrer"
                  />
                </div><br/>
                <div className="col-10">
                  <h4 className="d-inline" style={{fontFamily: "Outfit, sans-serif"}}>{props.post.user.name}</h4>
                  <br />
                  <small style={{fontFamily: "Outfit, sans-serif"}}>
                    {new Date(props.post.createdAt).toLocaleString("ear-MA", {
                              weekday: "long",
                              month: "long",
                              year: "numeric",
                              day: "numeric",
                            })}
                  </small>
                  <br/><br/><br/>
                </div></div>
                <div className="d-flex justify-content-between" style={{fontFamily: "Outfit, sans-serif"}}>
                    {localStorage.getItem('role')==='user' && <div><img
                        src={!upvoted?"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAChUlEQVR4nO2ZTYhOURjHf0MThqF3ehuNogwLRA0Ln6kxaykLspiVBQsKS8LOQiiKwmIUC6uxoCzMjJSFpKZMYaYxChn5DEO+BtOp/1untzv3feuee95zdX91Nvec/s/z3HvPOc95DuTk5NSCGcBp4D0wCpwHCmSMqcAt4F9ZGwaayBDH5PgroA1YCjzUs5NkhA7gD/AbWGs936BARsgARX0F4/Chsr5Zev6dwKkDbsjZPmBKWX+b+oYInH1y9C0wL6L/lPrPEjArgR/AX2BzRH8D8EGBrCJQZgJP5KTZN6LYpf67BMwlOTkATJ9kTGnp3U6gbJODX4Elk4xpt/aUegKkFfgsJ3fGjOvWmMMESD1wXw5ejRm3EBjX3tFMgBxXEM8rJIJnNO4iAdJupSDrYsbN1q9nluRlBEYz8Fpv+WCVG2RUM4vDx5g2CtxTmmNSG+cpyE050huRgpTTCfyKCaba9hiY6zKQPVYK0pJwAy1UaPOBLcAj2bziKghzGPok0a34Y7FsmrnmhAMS7MEvBWtOOaFHgmYn98kK2R10JfhGglHpeZpstL7IbheC4xI0RQWfTAPOWfYTJ52lpbBW7JX9B1kPpMnVpK91IGtk/2WWAykC/bJvktDMBjIg289clFxrGch12f5ZIdsOPpA64ITs3876ZC/+L6vWctl/kVToi4Qa8c8Ca8J3JRUblJCp3/qkE/hmrVqJc70LEjuCX7pkt99VFabDOh2aooIvVsuuKck6o0+i3VWc113RkMadyiJdbBrha8Ac/JVkn7oWXm8F8w44qmsC1yWbFh2kSiXZ/aRU8+11UOaptl1O+1fepLtzU3cac+z8GHAH2JFmADk5OWSTCQIHBIvH/7mJAAAAAElFTkSuQmCC":
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABiElEQVR4nO3ZyytEUQDH8a+wEguEtVhYWVgrwt5K/galKbb+AQs2ktiYjX/BziNl/AVkFGbKo5THXE3ejm4dm2m6c29z7pxH51u//Xy6ze3ce8Hn8+moHdgAHoFbYBvoxbJagWNAVOwK6MKilqsg/reKJU0BPxGQSyyoB7iPQIR7x/CagN0aiHDXGN5CDES4dQxuBPiICRnG0NqA85iIAwwuGxMRbhpDm0mAKADNGFg/UEoAWcTAWoBcAkQZ6MSyI4iw5ZY7VuMIUrlfYAgDjyB3Ca9GtT0DTxErAifAEtCh6wiienmgTyVkTgNCyO2oQoR3nBeNkKDRB8K0VlIF2dMMyauCPGiGfAIZFZBvzRCh6tApDFnOFcirK5AbVyArLkCK8rHaesgXMO4CRABHrkDKrkAK9UICAxACWKsXEvcFXNoHx+56IVuaEaeqvnZNGnA1lHWoEfKmjgGD8sOmDsgFihvVhJknhQaA/QYisvJVVGpNAJvAmXxOUPnjA/mfnE0T4PP5sLM/31LUcCrfy34AAAAASUVORK5CYII="}
                        alt="upvote"
                        style={{ cursor: "pointer", height: "25px" }}
                        onClick={handleUpvote} ></img>{" "} {upvoteCount}</div>}
                    {localStorage.getItem("loggedInUserId") === props.post.user._id && (<i
                        className="bi bi-trash"
                        style={{ color: "#a30505", cursor: "pointer" }}
                        onClick={handleDeletePost}></i>)}
                </div>
                <span></span>
                <div style={{marginTop:'10px', marginBottom:'10px'}}>
                  <Chip
                      variant="outlined"
                      color="primary"
                      size="md"
                      sx={{ pointerEvents: 'none', fontFamily: "Outfit, sans-serif" }}
                    >
                      {props.post.tags}
                  </Chip>
                </div>
                <big style={{fontFamily: "Outfit, sans-serif"}}> {props.post.heading} </big>
            </div>
          </Typography>
          <Typography level="body-lg" aria-describedby="card-description" mb={1} style={{fontFamily: "Outfit, sans-serif"}}>
              {props.post.body}
          </Typography>
            <button className= "btn bg-light border-1 border-primary" style={{marginBottom:'10px',width: "150px", cursor: "pointer", zIndex:'2', position: 'absolute', bottom: '7px', fontFamily: "Outfit, sans-serif"}} onClick={changeShowDetails}>Add Comment</button>
          <button
            className={`btn badge bg-${badgeColor()}`}
            style={{ zIndex: 1, cursor: "pointer", marginBottom: "10px",width: "150px", position: 'absolute', right: '7px'}}
            onClick={handleStatusChange}>{badgeText()}</button>
          {/* {requestedChange && (
            <div style = {{position:'absolute', right:'7px', top: '40px'}}>
              <span className="badge bg-success" style={{zIndex: "2", cursor: "pointer" ,marginRight: "10px" }} onClick={handleSubmitStatusChange}>Confirm</span>
              <span className="badge  bg-danger" style={{zIndex: "1", cursor: "pointer" }} onClick={handleCancelStatusChange}>Cancel</span>  
              <br/>
            </div>
          )} */}
        </CardContent>
      </Card>
      {showDetails && <ComplaintModal post={props.post} closeModal={changeShowDetails} />}
    </>
  );
};

export default Complaint;