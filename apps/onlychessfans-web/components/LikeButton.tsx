// const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[]>(
//   messages,
//   (state: Message[], newMessage: string) => [
//     ...state,
//     { message: newMessage },
//   ]
// )

import { useFormState } from 'react-dom';

type Props = {
  onLike: () => void;
  onDislike: () => void;
  liked: boolean;
  likesCount: number;
};

export default (props: Props) => {
  // const [state, formAction] = useFormState(createTodo, initialState)

  return (
    <button
      className="text-xl group"
      onClick={() => (props.liked ? props.onDislike() : props.onLike())}
    >
      {props.liked ? (
        <>❤️</>
      ) : (
        <>
          <span className="inline group-hover:hidden">♡</span>
          <span className="hidden group-hover:inline">🤍</span>
        </>
      )}{' '}
      {props.likesCount}
    </button>
  );
};
