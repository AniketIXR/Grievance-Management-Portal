import React, {useContext, useEffect} from 'react';
import Comment from './Comment';
import commentContext from "../context/comment/commentContext";
import Loader from './Loader';


const CommentList = (props) => {

    const contextComment = useContext(commentContext);
    const { comments, getComments, loading, totalComments, resetToDefaultState } = contextComment;

    // const {id} = useParams();

    useEffect(() => {
      getComments(props.id);
      return () => {resetToDefaultState()};
      //eslint-disable-next-line
    }, [])
    

    return (
        <div className="col" style={{ height: "100vh"  }} >
            <div  className='card card-shadow overflow-auto'>  {/* style={{height: "70vh"}}  */}
                {
                    loading? <Loader/> : (
                        totalComments===0 ? <p className='text-muted my-4' style={{ textAlign: 'center' }}>No comments</p> :
                        comments.map( (comment)=>{
                            return(
                                <Comment key={comment._id} comment={comment} />
                            )
                        } ) 
                    )
                }
            </div>
        </div>
    )
}

export default CommentList;