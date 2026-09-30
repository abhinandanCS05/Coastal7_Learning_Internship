import{useEffect,useState}from"react";
import{Search,Plus,ShoppingCart,Edit3,Trash2,UploadCloud,Image as ImageIcon,X}from"lucide-react";
import{useForm}from"react-hook-form";
import{z}from"zod";
import{zodResolver}from"@hookform/resolvers/zod";
import{useDropzone}from"react-dropzone";
import api from"../services/api";
import{Modal,Toast}from"../components/UI";
import{useAuth}from"../context/AuthContext";

const productSchema=z.object({
  name:z.string().trim().min(2,"Product name must contain at least 2 characters"),
  description:z.string().trim().min(5,"Add a short product description"),
  price:z.coerce.number().positive("Price must be greater than 0"),
  stock:z.coerce.number().int("Stock must be a whole number").min(0,"Stock cannot be negative")
});

const IMAGE_TYPES={
  "image/jpeg":[".jpg",".jpeg",".jfif"],
  "image/png":[".png"],
  "image/webp":[".webp"]
};

export default function Products(){

  const[ps,setPs]=useState([]);
  const[q,setQ]=useState("");
  const[open,setOpen]=useState(false);
  const[edit,setEdit]=useState(null);
  const[toast,setToast]=useState("");
  const[selectedFile,setSelectedFile]=useState(null);
  const[preview,setPreview]=useState("");
  const[busy,setBusy]=useState(false);
  const{role}=useAuth();

  const{
    register,
    handleSubmit,
    reset,
    formState:{errors}
  }=useForm({
    resolver:zodResolver(productSchema),
    defaultValues:{
      name:"",
      description:"",
      price:"",
      stock:""
    }
  });

  async function load(){
    try{
      setPs((await api.get("/products")).data);
    }catch(error){
      setToast(error.response?.data?.detail||"Unable to load products");
    }
  }

  useEffect(()=>{
    load();
  },[]);


  function imageUrl(filename){
    if(!filename)return"";
    return`http://127.0.0.1:8000/files/${encodeURIComponent(filename)}`;
  }


  function openCreate(){
    setEdit(null);
    reset({
      name:"",
      description:"",
      price:"",
      stock:""
    });
    setSelectedFile(null);
    setPreview("");
    setOpen(true);
  }


  function openEdit(product){
    setEdit(product);

    reset({
      name:product.name,
      description:product.description,
      price:product.price,
      stock:product.stock
    });

    setSelectedFile(null);
    setPreview(
      product.image_filename
        ?imageUrl(product.image_filename)
        :""
    );

    setOpen(true);
  }


  function clearSelectedImage(){
    setSelectedFile(null);
    setPreview(
      edit?.image_filename
        ?imageUrl(edit.image_filename)
        :""
    );
  }


  const onDrop=(acceptedFiles,rejectedFiles)=>{

    if(rejectedFiles.length){
      setToast("Please select a JPG, PNG or WEBP image under 5 MB");
      return;
    }

    const file=acceptedFiles[0];

    if(!file)return;

    setSelectedFile(file);

    const localUrl=URL.createObjectURL(file);
    setPreview(localUrl);

    setToast("Image preview ready — save the product to upload it");
  };


  const{
    getRootProps,
    getInputProps,
    isDragActive
  }=useDropzone({
    onDrop,
    accept:IMAGE_TYPES,
    maxSize:5*1024*1024,
    multiple:false
  });


  async function uploadImage(productId,file){

    const formData=new FormData();
    formData.append("file",file);

    await api.post(
      `/products/${productId}/image`,
      formData
    );
  }


  async function save(data){

    setBusy(true);

    try{

      let product;

      if(edit){
        product=(
          await api.put(
            `/products/${edit.id}`,
            {
              name:data.name,
              description:data.description,
              price:data.price,
              stock:data.stock
            }
          )
        ).data;
      }else{
        product=(
          await api.post(
            "/products",
            {
              name:data.name,
              description:data.description,
              price:data.price,
              stock:data.stock
            }
          )
        ).data;
      }


      if(selectedFile){
        await uploadImage(product.id,selectedFile);
      }


      await load();

      setOpen(false);
      setEdit(null);
      setSelectedFile(null);
      setPreview("");

      setToast(
        selectedFile
          ?"Product and image saved successfully"
          :edit
            ?"Product updated successfully"
            :"Product created successfully"
      );

    }catch(error){

      setToast(
        error.response?.data?.detail||
        "Unable to save product"
      );

    }finally{
      setBusy(false);
    }
  }


  async function add(id){
    try{
      await api.post(
        "/cart/items",
        {
          product_id:id,
          quantity:1
        }
      );

      setToast("Product added to cart");

    }catch(error){
      setToast(
        error.response?.data?.detail||
        "Unable to add product"
      );
    }
  }


  async function del(id){

    if(!window.confirm("Delete this product?"))return;

    try{
      await api.delete(`/products/${id}`);
      await load();
      setToast("Product deleted");

    }catch(error){
      setToast(
        error.response?.data?.detail||
        "Delete failed"
      );
    }
  }


  const shown=ps.filter(p=>
    p.name.toLowerCase().includes(q.toLowerCase())
  );


  return(
    <div className="space-y-7">

      <div className="flex flex-wrap items-end justify-between gap-4">

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
            Catalog
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your store catalog and inventory.
          </p>
        </div>

        {role==="admin"&&(
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700 dark:bg-indigo-600"
          >
            <Plus size={17}/>
            Add product
          </button>
        )}

      </div>


      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-3.5 text-slate-400"
        />

        <input
          value={q}
          onChange={e=>setQ(e.target.value)}
          aria-label="Search products"
          placeholder="Search products..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900"
        />

      </div>


      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {shown.map(p=>(
          <article
            key={p.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >

            <div className="h-52 overflow-hidden border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">

              {p.image_filename?(
                <img
                  src={imageUrl(p.image_filename)}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ):(
                <div className="grid h-full place-items-center text-slate-300">
                  <ShoppingCart size={50}/>
                </div>
              )}

            </div>


            <div className="p-5">

              <div className="flex justify-between gap-4">

                <div className="min-w-0">
                  <h2 className="truncate font-black">
                    {p.name}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                    {p.description}
                  </p>
                </div>

                <strong className="shrink-0">
                  {Number(p.price).toFixed(2)}
                </strong>

              </div>


              <p className="mt-4 text-xs font-bold text-slate-400">
                {p.stock?`${p.stock} in stock`:"Out of stock"}
              </p>


              <div className="mt-4 flex gap-2">

                {role==="user"&&(
                  <button
                    disabled={!p.stock}
                    onClick={()=>add(p.id)}
                    className="flex-1 rounded-xl bg-indigo-600 p-2.5 text-sm font-black text-white disabled:bg-slate-300"
                  >
                    Add to cart
                  </button>
                )}


                {role==="admin"&&(
                  <>
                    <button
                      onClick={()=>openEdit(p)}
                      className="flex-1 rounded-xl border border-slate-200 p-2.5 text-sm font-bold hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700"
                    >
                      <Edit3 size={14} className="mr-1 inline"/>
                      Edit
                    </button>

                    <button
                      onClick={()=>del(p.id)}
                      aria-label={`Delete ${p.name}`}
                      className="rounded-xl border border-red-200 p-2.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </>
                )}

              </div>

            </div>

          </article>
        ))}

      </div>


      <Modal
        open={open}
        onClose={()=>{
          if(!busy)setOpen(false);
        }}
        title={edit?"Edit product":"Create product"}
      >

        <form
          onSubmit={handleSubmit(save)}
          className="space-y-5"
          noValidate
        >

          <div>

            <label
              htmlFor="product-name"
              className="mb-2 block text-sm font-bold"
            >
              Product name
            </label>

            <input
              id="product-name"
              {...register("name")}
              placeholder="e.g. Wireless Keyboard"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900"
            />

            {errors.name&&(
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.name.message}
              </p>
            )}

          </div>


          <div>

            <label
              htmlFor="product-description"
              className="mb-2 block text-sm font-bold"
            >
              Description
            </label>

            <textarea
              id="product-description"
              rows={3}
              {...register("description")}
              placeholder="Describe the product..."
              className="w-full resize-none rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900"
            />

            {errors.description&&(
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.description.message}
              </p>
            )}

          </div>


          <div className="grid grid-cols-2 gap-3">

            <div>

              <label
                htmlFor="product-price"
                className="mb-2 block text-sm font-bold"
              >
                Price
              </label>

              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                {...register("price")}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900"
              />

              {errors.price&&(
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.price.message}
                </p>
              )}

            </div>


            <div>

              <label
                htmlFor="product-stock"
                className="mb-2 block text-sm font-bold"
              >
                Stock
              </label>

              <input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                {...register("stock")}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900"
              />

              {errors.stock&&(
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.stock.message}
                </p>
              )}

            </div>

          </div>


          <div>

            <p className="mb-2 text-sm font-bold">
              Product image
            </p>

            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition ${
                isDragActive
                  ?"border-indigo-500 bg-indigo-50"
                  :"border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
              }`}
            >

              <input {...getInputProps()}/>

              {preview?(
                <div className="relative">

                  <img
                    src={preview}
                    alt="Product image preview"
                    className="mx-auto h-52 w-full rounded-xl object-cover"
                  />

                  {selectedFile&&(
                    <button
                      type="button"
                      onClick={e=>{
                        e.stopPropagation();
                        clearSelectedImage();
                      }}
                      aria-label="Remove selected image"
                      className="absolute right-2 top-2 rounded-lg bg-white p-2 text-slate-700 shadow"
                    >
                      <X size={16}/>
                    </button>
                  )}

                </div>
              ):(
                <div className="py-8">

                  <UploadCloud
                    size={28}
                    className="mx-auto text-indigo-500"
                  />

                  <p className="mt-3 text-sm font-black">
                    {isDragActive
                      ?"Drop the image here"
                      :"Choose or drag an image"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, JPEG, PNG or WEBP · Maximum 5 MB
                  </p>

                </div>
              )}

            </div>

            {selectedFile&&(
              <p className="mt-2 text-xs font-medium text-indigo-600">
                Preview ready: {selectedFile.name}
              </p>
            )}

          </div>


          <button
            disabled={busy}
            className="w-full rounded-xl bg-slate-950 p-3.5 text-sm font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600"
          >
            {busy
              ?"Saving product..."
              :edit
                ?"Save changes"
                :"Create product"
            }
          </button>

        </form>

      </Modal>


      <Toast
        message={toast}
        onClose={()=>setToast("")}
      />

    </div>
  );
}
