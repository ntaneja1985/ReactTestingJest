import React from 'react'

function UserList({users}) {
    const renderedUsers = users.map((user) => {
        return (
            <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.email}</td>
            </tr>
        )
    })

    return (
    <>
        {users && users.length > 0 ?
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody data-testid="users">
                {renderedUsers}
                </tbody>
            </table>  : <p>No users found!</p>}

    </>
)
}

export default UserList
