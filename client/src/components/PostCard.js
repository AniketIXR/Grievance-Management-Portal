// import React from 'react';
// import { Card, Image, Stack, Heading, Text, Button, Grid, Link } from '@chakra-ui/react';
// import { Chip } from '@mui/material';

// const PostCard = (props) => {


    


//   return (
//     <Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline'>
//         <Grid templateColumns="repeat(6,1fr)"> 
//             <GridItem colSpan={2}>
//                 <Image
//                     objectFit='cover'
//                     maxW={{ base: '100%', sm: '200px' }}
//                     src={props.post.image[0]}
//                     alt='Hmmm.....wait a min!!!'
//                 />
//             </GridItem>
//             <GridItem colSpan={4}>
//                 <Stack>
//                     <CardBody>
                        
//                         <img
//                   src={props.post.user.photo}
//                   alt="UserLogo"
//                   className="circle_img"
//                   referrerPolicy="no-referrer"
//                 />
//                 <Heading size='md'>{props.post.user.name}</Heading>
//                 <Text py='2'>{props.post.heading}</Text>
//                 <Chip
//           variant="outlined"
//           color="primary"
//           size="sm"
//           sx={{ pointerEvents: 'none' }}
//         >
//           {new Date(props.post.createdAt).toLocaleString("ear-MA", {
//                     weekday: "long",
//                     month: "long",
//                     year: "numeric",
//                     day: "numeric",
//                   })}
//         </Chip>        


//         <div className="d-flex justify-content-between">
//             <div>
//               <i
//                 className="bi bi-arrow-up-circle-fill"
//                 style={{ color: upvoted ? "green" : "grey" }}
//                 onClick={handleUpvote}
//               ></i>{" "}
//               {upvoteCount}
//               <i
//                 className="bi bi-arrow-down-circle-fill"
//                 style={{
//                   color: downvoted ? "red" : "grey",
//                   marginLeft: "10px",
//                 }}
//                 onClick={handleDownvote}
//               ></i>{" "}
//               {downvoteCount}
//             </div>
//             {localStorage.getItem("loggedInUserId") === props.post.user._id && (
//               <i
//                 className="bi bi-trash"
//                 style={{ color: "#a30505" }}
//                 onClick={handleDeletePost}
//               ></i>
//             )}
//           </div>

//             <Text py='2'>{props.post.body}</Text>
//                     </CardBody>

//                     <CardFooter>
//                     <Link style={{cursor: "pointer", zIndex:'2'}} key={props.post._id} to={`/postdetails/${props.post._id}`} style={{ color:"inherit", textDecoration:"inherit" }}>
//           Comment
//         </Link>
//                     </CardFooter>
//                 </Stack>
//             </GridItem>
//         </Grid>
//     </Card>
//   );
// };

// export default PostCard;
