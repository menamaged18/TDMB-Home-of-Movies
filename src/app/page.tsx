'use client';
import { Provider } from 'react-redux';
import { store } from '../reduxStore/rStore/store';
import DisplayMD from "@/app/pages/DisplayMD";
import Header from "@/components/headerComponent/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div>
        <main>
        <Provider store={store}>
          <DisplayMD />
        </Provider>
        </main>
      </div>    
    </>
  );
}
