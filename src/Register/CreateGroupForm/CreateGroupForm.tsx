export default function CreateGroupForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log(e.currentTarget.elements)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name"></input>
      </div>
      <button type="submit">Create</button>
    </form>
  )
}
