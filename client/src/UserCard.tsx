
interface Prop {
    email?: string
}
interface Person extends Prop {
    name: string;
    age: number

}

const UserCard: React.FC<Person> = ({ name, age, email }) => (

    <div>

        <label className="text-xl p-8">{name}</label>
        <label>{age}</label>
        <label>{email}</label>

    </div>

);

export default UserCard