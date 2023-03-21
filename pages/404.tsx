import { NextSeo } from "next-seo";

export default function Page404() {
  const refresh = () => {
    location.href = location.origin;
  };

  return (
    <>
      <NextSeo title="Không tìm thấy trang" />
      <div className="flex-col max-w-lg px-8 py-40 mx-auto text-center text-gray-700 flex-center">
        <img className="w-20 mb-6" src="/assets/imgs/404.svg" />
        <h2 className="mb-8 text-xl font-semibold">Không tìm thấy trang.</h2>
        <button className="h-12 shadow-md btn-info is-large" onClick={refresh}>
          Trở về trang chủ
        </button>
      </div>
    </>
  );
}
