type CommentType = {
  id: number;
  user_id: number;
  request_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
};
