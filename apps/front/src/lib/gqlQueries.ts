import gql from "graphql-tag";

export const GET_POSTS = gql`
  query posts($skip: Int, $take: Int, $filters: PostFiltersInput) {
    posts(skip: $skip, take: $take, filters: $filters) {
      posts {
        id
        title
        excerpt
        thumbnail
        content
        createdAt
        publishedAt
        readingTimeMinutes
        slug
        _count {
          likes
          comments
        }
        author {
          id
          name
          avatar
        }
        category {
          id
          name
          slug
        }
        tags {
          id
          name
          slug
        }
      }
      total
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query getPostById($id: Int!) {
    getPostById(id: $id) {
      id
      title
      excerpt
      thumbnail
      content
      createdAt
      updatedAt
      publishedAt
      slug
      status
      readingTimeMinutes

      author {
        id
        name
        avatar
      }

      category {
        id
        name
        slug
        description
      }

      tags {
        id
        name
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query getPostBySlug($slug: String!) {
    getPostBySlug(slug: $slug) {
      id
      title
      excerpt
      thumbnail
      content
      createdAt
      updatedAt
      publishedAt
      slug
      status
      readingTimeMinutes
      wordCount

      author {
        id
        name
        avatar
      }

      category {
        id
        name
        slug
        description
      }

      tags {
        id
        name
        slug
      }

      _count {
        likes
        comments
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation signIn($input: SignInInput!) {
    signIn(signInInput: $input) {
      user {
        id
        name
        avatar
      }
      accessToken
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation signUp($input: SignUpInput!) {
    signUp(signUpInput: $input) {
      message
    }
  }
`;

export const GET_POST_COMMENTS = gql`
  query getPostComments($postId: Int!, $take: Int, $skip: Int) {
    getPostComments(postId: $postId, take: $take, skip: $skip) {
      id
      content
      createdAt
      author {
        name
        avatar
      }
    }

    postCommentCount(postId: $postId)
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(createCommentInput: $input) {
      message
    }
  }
`;

export const POST_LIKES = gql`
  query PostLikeData($postId: Int!) {
    postLikesCount(postId: $postId)
    userLikedPost(postId: $postId)
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: Int!) {
    likePost(postId: $postId)
  }
`;

export const UNLIKE_POST_MUTATION = gql`
  mutation UnLikePost($postId: Int!) {
    unlikePost(postId: $postId)
  }
`;

export const GET_USER_POSTS = gql`
  query GetUserPosts($skip: Int, $take: Int, $status: PostStatus) {
    getUserPosts(skip: $skip, take: $take, status: $status) {
      posts {
        id
        title
        excerpt
        slug
        thumbnail
        status
        publishedAt
        createdAt
        updatedAt
        content
        readingTimeMinutes
        wordCount

        author {
          name
          avatar
        }

        category {
          id
          name
          slug
        }

        tags {
          id
          name
        }

        _count {
          likes
          comments
        }
      }

      stats {
        total
        published
        drafts
      }
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePostMutation($input: CreatePostInput!) {
    createPost(createPostInput: $input) {
      message
    }
  }
`;

export const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(updatePostInput: $input) {
      message
    }
  }
`;

export const DELETE_POST_MUTATION = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId)
  }
`;

export const GET_CATEGORIES = gql`
  query categories {
    categories {
      id
      name
      slug
      description
    }
  }
`;

export const GET_TAGS = gql`
  query tags {
    tags {
      id
      name
      slug
    }
  }
`;

export const GET_USER = gql`
  query user {
    user {
      id
      name
      email
      bio
      avatar
      status
      isEmailVerified
    }
  }
`;

export const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($token: String!) {
    verifyEmail(token: $token) {
      message
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) {
      message
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      message
    }
  }
`;

export const DEACTIVATE_ACCOUNT_MUTATION = gql`
  mutation deactivateAccount {
    deactivateAccount
  }
`;

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation deleteAccount {
    deleteAccount
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(forgotPasswordInput: $input) {
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(resetPasswordInput: $input) {
      message
    }
  }
`;

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email) {
      message
    }
  }
`;

export const GET_POSTS_FOR_SITEMAP = gql`
  query GetPostsForSitemap($skip: Int!, $take: Int!) {
    posts(skip: $skip, take: $take) {
      posts {
        slug
        createdAt
        updatedAt
      }
      total
    }
  }
`;
