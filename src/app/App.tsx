import React, { useEffect, useState } from "react";
import "./App.css";
import SpotifyEmbededTrack from "./SpotifyEmbededTrack";
import Playlist from "./playlist.json";

type PlaylistT = typeof Playlist;
type Track = PlaylistT["data"]["playlistV2"]["content"]["items"][0];
type User = Track["addedBy"]["data"];

function randomSong() {
  const size = Playlist.data.playlistV2.content.items.length;
  return Playlist.data.playlistV2.content.items[
    Math.floor(Math.random() * size)
  ];
}

function getUniqueUsers(tracks: Track[]): User[] {
  return [
    ...new Map(
      tracks.map((item) => [item.addedBy.data.uri, item.addedBy.data])
    ).values(),
  ];
}

const Players = getUniqueUsers(Playlist.data.playlistV2.content.items);

console.log({ Playlist, Players });

function isAnswerCorrect(song: Track, answer: User | null): boolean {
  console.log({song, answer})
  return answer?.uri == song.addedBy.data.uri;
}

function App() {
  const [song, setSong] = useState(randomSong());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [answer, setAnswer] = useState<User | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);

  console.log(song);

  return (
    <div className="min-w-full min-h-full flex flex-col content-center justify-center pt-20 p-5 gap-5">
      {/* <h1 className="mb-20 text-5xl font-extrabold text-center">
        High Score: {highScore}
      </h1> */}
      <h1 className="mb-20 text-5xl font-extrabold text-center">
        Score: {score}
      </h1>

      <SpotifyEmbededTrack songId={song.itemV2.data.uri} />

      <div className="flex flex-col lg:flex-row justify-around gap-5">
        {Players.map((player) => (
          <Answer
            player={player}
            selectedAnswer={answer}
            correctAnswer={song.addedBy.data}
            setAnswer={setAnswer}
            answerLocked={answerLocked}
          />
        ))}
      </div>

      {!answerLocked && (
        <button
          onClick={() => {
            if (answer === null) return;
            setAnswerLocked(true);
            if (isAnswerCorrect(song, answer)) {
              setScore(score + 1);
              if (score > highScore) {
                setHighScore(score);
              }
            }
          }}
          className="w-full border-neutral-500 outline-neutral-300 bg-slate-500/50 rounded-xl border px-5 py-3 hover:outline outline-offset-2"
        >
          Guess
        </button>
      )}

      {answerLocked && (
        <button
          onClick={() => {
            setSong(randomSong());
            setAnswer(null);
            setAnswerLocked(false);
            if (!isAnswerCorrect(song, answer)) {
              setScore(0);
            }
          }}
          className="w-full border-neutral-500 outline-neutral-300 bg-slate-500/50 rounded-xl border px-5 py-3 hover:outline outline-offset-2"
        >
          {isAnswerCorrect(song, answer) ? "Continue" : "Play Again"}
        </button>
      )}
    </div>
  );
}

type AnswerProps = {
  player: User;
  answerLocked: boolean;
  selectedAnswer: User | null;
  correctAnswer: User;
  setAnswer: (user: User) => void;
};

function Answer({
  player,
  answerLocked,
  selectedAnswer,
  correctAnswer,
  setAnswer,
}: AnswerProps) {
  const isThisOptionSelected = selectedAnswer?.uri == player.uri;
  const isThisOptionCorrect = correctAnswer.uri == player.uri;

  let backgroundColor = "";

  if (answerLocked && isThisOptionSelected && !isThisOptionCorrect) {
    backgroundColor = "bg-red-500/50";
  } else if (answerLocked && isThisOptionCorrect) {
    backgroundColor = "bg-green-500/50";
  } else if (isThisOptionSelected) {
    backgroundColor = "bg-slate-500/50";
  }

  return (
    <div
      className={`w-full lg:p-5 p-2 flex cursor-pointer rounded-xl border border-dashed border-neutral-500 ${backgroundColor} outline-offset-4 outline-neutral-300 hover:outline`}
      onClick={() => setAnswer(player)}
    >
      <img
        className="w-10 h-10 rounded-xl align-middle	"
        src={player.avatar?.sources[0].url}
      />
      <span className="leading-10 ps-5 text-center">{player.name}</span>
    </div>
  );
}

export default App;
