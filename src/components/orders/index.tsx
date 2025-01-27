  
import {
  Card,
} from "@material-tailwind/react";
 
 
export function OrdersTable() {
  return (
     <Card className="mt-4">
 
<div className="p-4 max-w-md mx-auto flow-root">
  <ul role="list" className="-mb-8">
    <li>
      <div className="relative pb-8">
        <span
          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full  flex items-center justify-center ring-8 ring-white">
            <img
                className="h-6 w-6 text-white"
                viewbox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
              />
            </span>
          </div>
          <div>
            <span className="h-8 w-8 rounded-full  flex items-center justify-center ring-8 ring-white">
            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            </span>
          </div>
          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p className="text-sm text-gray-500">
                aguardando a confirmação de{" "}
                <a href="#" className="font-medium text-gray-900">
                  coleta
                </a>
              </p>
              <p className="text-sm text-gray-500">
                coleta confirmada!{" "}
                <a href="#" className="font-medium text-gray-900">
                 roteirizando...
                </a>
              </p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-gray-500">
              <time dateTime="2020-09-20">Sep 20</time>
            </div>
          </div>
        </div>
      </div>
      
    </li>
    <li>
      <div className="relative pb-8">
        <span
          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full  flex items-center justify-center ring-8 ring-white">
              <img
                className="h-6 w-6 text-white"
                viewbox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                src=" https://cdn-icons-png.flaticon.com/512/8583/8583437.png "
              />
            </span>
          </div>
          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p className="text-sm text-gray-500">
                 Responsável pela Coleta: {" "}
                <a href="#" className="font-medium text-gray-900">
                 Motorista,{" "}
                </a>
                Veículo: {" "}
                <a href="#" className="font-medium text-gray-900">
                 AAAA-8888
                </a>
              </p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-gray-500">
              <time dateTime="2020-09-22">Sep 22</time>
            </div>
          </div>
        </div>
      </div>
    </li>
    <li>
      <div className="relative pb-8">
        <span
          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
              <img
                className="h-6 w-6 text-white"
                viewbox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                src="https://previews.123rf.com/images/aquamann/aquamann1112/aquamann111200016/11660618-cone-de-caminh%C3%A3o-verde.jpg"
                clipRule="evenodd"
              />
            </span>
          </div>
          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p className="text-sm text-gray-500">
                O motorista está à {" "}
                <a href="#" className="font-medium text-gray-900">
                  {" "}
                  caminho
                </a>
              </p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-gray-500">
              <time dateTime="2020-09-28">Sep 28</time>
            </div>
          </div>
        </div>
      </div>
    </li>
    {/* <li>
      <div className="relative pb-8">
        <span
          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
          aria-hidden="true"
        />
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
              <img
                className="h-5 w-5 text-white"
                viewbox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                src="https://res.cloudinary.com/teepublic/image/private/s--AwgOGWhQ--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1615488250/production/designs/20135311_0.jpg"
              />
            </span>
          </div>
          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p className="text-sm text-gray-500">
                with driver{" "}
                <a href="#" className="font-medium text-gray-900">
                  on the way to you
                </a>
              </p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-gray-500">
              <time dateTime="2020-09-30">Sep 30</time>
            </div>
          </div>
        </div>
      </div>
    </li> */}
    <li>
      <div className="relative pb-8">
        <div className="relative flex space-x-3">
          <div>
            <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p className="text-sm text-gray-500">
                Sua mercadoria foi coletada!{" "}
                <a href="#" className="font-medium text-gray-900">
                   
                </a>
              </p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-gray-500">
              <time dateTime="2020-10-04">Oct 4</time>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>

     </Card>
 
  
  );
}