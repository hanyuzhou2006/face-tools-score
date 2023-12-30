
interface ResultProps {
  score: number;
}

export default function Result({ score }: ResultProps) {
  return (
    <div className="flex flex-col">
      <h2>{score.toFixed(2)}</h2>
    </div>
  )
}