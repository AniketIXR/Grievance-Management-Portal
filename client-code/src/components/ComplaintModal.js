import React, {useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";
import CommentList from "./CommentList";
import postDetailsContext from "../context/postDetails/postDetailsContext";
import loginContext from "../context/login/loginContext";
import Loader from "./Loader";
import "../styles/comment.css";
import commentContext from "../context/comment/commentContext";

const ComplaintModal = (props) => {
    const contextPostDetails = useContext(postDetailsContext);
    const {getPost, loading, setLoading} = contextPostDetails;
    const contextLogin = useContext(loginContext);
    const { isLoggedIn } = contextLogin;
    const navigate = useNavigate();

    useEffect( () => {
        getPost(props.post._id);
        if(isLoggedIn !== "loggedin")
            navigate("/");
        return () => { setLoading(true) }
        //ar
    }, []);

    const contextComment = useContext(commentContext);
    const { currentComment, setCurrentComment, AddNewComment } = contextComment;

    const postClick = (e) => {
        e.preventDefault();
        AddNewComment(props.post._id);
    }

    const commentChange = (e) => {
        setCurrentComment({
          ...currentComment,
          [e.target.name]: e.target.value
        })
      }

    return (
        <div class="modal">
            <article class="modal-container">
                <header class="modal-container-header">
                    <h1 class="modal-container-title">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path fill="currentColor" d="M14 9V4H5v16h6.056c.328.417.724.785 1.18 1.085l1.39.915H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8v1h-7zm-2 2h9v5.949c0 .99-.501 1.916-1.336 2.465L16.5 21.498l-3.164-2.084A2.953 2.953 0 0 1 12 16.95V11zm2 5.949c0 .316.162.614.436.795l2.064 1.36 2.064-1.36a.954.954 0 0 0 .436-.795V13h-5v3.949z" />
                        </svg>
                        {props.post.heading}
                    </h1>
                    <button class="icon-button" onClick={props.closeModal} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                        </svg>
                    </button>
                </header>
                <section class="modal-container-body rtf">
                    <div className="col-sm-12 col-md-6 col-lg-4">{loading ? <Loader /> : <img style={{height: '30vh'}} src={props.post.images[0]} loading="lazy" alt="postLogo"/>}</div>
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
                            <h2 className="d-inline">{props.post.user.name}</h2>
                        </div>
                    </div>
                    {new Date(props.post.createdAt).toLocaleString("ear-MA", {
                        weekday: "long",
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                    })}
        
                    <p>{props.post.body}</p>
                    <CommentList id = {props.post._id}/>        
                </section>
                <footer class="modal-container-footer">
                    <input type="text" placeholder="Write a comment...." className="form-control" id="comment" value={currentComment.comment} name='comment' onChange={commentChange}/>
                    <button class="button is-ghost" onClick={props.closeModal}>Cancel</button>
                    <button class="button is-primary" onClick={postClick} disabled={currentComment.comment.length<1} type="submit">Post</button>
                </footer>
            </article>
        </div>
        // <section className="min-vh-100">
        //     <div className="row d-flex justify-content-center align-items-center mx-1">
        //         <div className="col-sm-12 col-md-6 col-lg-4">{loading ? <Loader /> : <PostItem key={post._id} post={post} />}</div>
        //         <div className="col-sm-12 col-md-6 col-lg-7 mx-2"><Comment /></div>
        //     </div>
        // </section>
    );
}

export default ComplaintModal;