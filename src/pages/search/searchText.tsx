import { useEffect } from 'react';
import { useSearchParams } from 'react-router'
import { searchTextByKeyword } from '../../api/http/api';

export default function SearchText() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    useEffect(() => {
        const init = async () => {
            try {
                const res = await searchTextByKeyword(keyword ?? '');

                console.log(res);
            } catch {

            }
        }
        init();
    }, [keyword])
    return <>

    </>
}
