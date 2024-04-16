import React, { useContext, useEffect } from "react";
import PostItem from "./PostItem";
import postContext from "../context/post/postContext";
import InfiniteScroll from "react-infinite-scroll-component"
import {Link} from "react-router-dom";
import Spinner from "./Spinner"
import { Grid, GridItem, SimpleGrid } from "@chakra-ui/react";

const Post = () => {

  const contextPost = useContext(postContext);
  const { posts, getPosts, totalPosts,  resetToDefaultState, filter } = contextPost;

  useEffect(() => {
    document.title = "Complaint Management Portal - Home";
    getPosts();
    return () => {resetToDefaultState()};
    //eslint-disable-next-line
  }, [filter])


  return (
    <InfiniteScroll
      dataLength={posts.length} //This is important field to render the next data
      next={getPosts}
      hasMore={posts.length !== totalPosts}
      loader={<Spinner />}
      scrollThreshold ={0.8}
    >
      
      {/* <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 g-2 mx-0 my-1" > */}
      <SimpleGrid columns={2} spacing={20} margin={10} minChildWidth={700}>
        {
          posts.map((post) => {
            return (
              
                <PostItem key={post._id} post={post} />
     
            );
          })
        }
        </SimpleGrid>
      {/* </div> */}
      
    </InfiniteScroll>




  );
};

export default Post;
