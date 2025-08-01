import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {createServer} from "../../test/server";
import useUser from '../../hooks/useUser'
import AuthButtons from './AuthButtons';
import {SWRConfig} from "swr";

async function  renderComponent(){
     render(
         <SWRConfig value = {{provider: () => new Map()}}>
         <MemoryRouter>
        <AuthButtons/>
    </MemoryRouter>
         </SWRConfig>)

     await screen.findAllByRole('link')
}

describe('when user is not signed in',()=>{
    //createServer --->GET 'api/user' --> {user: null}
    createServer([
        {path: 'api/user', res: () =>{
                return {
                    user: null
                }
            }}
    ])
    test('sign in and signup are visible',async()=>{
        await renderComponent();

        const signInButton = screen.getByRole('link',{
            name: /sign in/i
        })

        const signUpButton = screen.getByRole('link',{
            name: /sign up/i
        })

        expect(signInButton).toBeInTheDocument();
        expect(signInButton).toHaveAttribute('href','/signin')
        expect(signUpButton).toBeInTheDocument();
        expect(signUpButton).toHaveAttribute('href','/signup')
    });
    test('signout is not visible', async()=>{
        await renderComponent();
        //Here getByRole will throw an error if the element is not present
        //Use queryBy to check if the element is not present
        const signOutButton = screen.queryByRole('link',{
            name: /sign out/i
        })

        expect(signOutButton).not.toBeInTheDocument()

    })
})
describe('when user is signed in',()=>{
    //createServer --->GET 'api/user' --> {user: {id:3, email: 'ntaneja@live.com'}}
    createServer([
        {path: 'api/user', res: () =>{
                return {
                    user: {id:3, email: 'ntaneja@live.com'}
                }
            }}
    ])
    test('signedin and signup is not visible', async()=>{
        await renderComponent();
        const signInButton = screen.queryByRole('link',{
            name: /sign in/i
        })

        const signUpButton = screen.queryByRole('link',{
            name: /sign up/i
        })

        expect(signInButton).not.toBeInTheDocument()
        expect(signUpButton).not.toBeInTheDocument()
    })
    test('signout is visible', async()=>{
        await renderComponent();
        const signOutButton = screen.getByRole('link',{
            name: /sign out/i
        })

        expect(signOutButton).toBeInTheDocument()
        expect(signOutButton).toHaveAttribute('href','/signout')
    })
})



const pause = ()=> new Promise(resolve => setTimeout(resolve, 1000))

