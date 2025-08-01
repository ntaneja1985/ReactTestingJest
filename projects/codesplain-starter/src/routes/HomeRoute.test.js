import {render,screen} from '@testing-library/react';
import {setupServer} from "msw/node";
import {rest} from 'msw';
import {MemoryRouter} from "react-router-dom";
import HomeRoute from './HomeRoute';
import {expect} from "playwright/test";
import {createServer} from "../test/server";

//GOAL
//Create a configuration object
//Each test file can define its own routes
createServer([
    {
        path: '/api/repositories',
        method: 'get',
        res: (req) =>{
            const query = req.url.searchParams.get('q');
            const language = query.split('language:')[1];
            return {
                items: [
                    {
                        id: 1,
                        full_name:`${language}_one`
                    },
                    {
                        id: 2,
                        full_name:`${language}_two`
                    }
                ]
            }
        }
    }
]);

//

test('renders 2 links for each language',async ()=>{
    render(
        <MemoryRouter>
            <HomeRoute/>
        </MemoryRouter>
        )

    // await pause();
    //  screen.debug();
    const languages = [
        'javascript',
        'typescript',
        'rust',
        'go',
        'python',
        'java'
    ]

    //Loop over each language

    for(let language of languages){
        //For each language make sure we see 2 links
        const links = await screen.findAllByRole('link', {
            name: new RegExp(`${language}_`),
        })

        expect(links).toHaveLength(2)
        //Assert that links have fullname
        expect(links[0]).toHaveTextContent(`${language}_one`)
        expect(links[1]).toHaveTextContent(`${language}_two`)
        //expect(links[0]).toHaveAttribute('href',`/repositories/${language}_one`)
        //expect(links[1]).toHaveAttribute('href',`/repositories/${language}_two`)
    }


})

const pause = () => new Promise(resolve => setTimeout(resolve, 1000))