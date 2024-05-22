import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

export const getSellinglist = async (userId) => {
  const { data: findlist, error: NotFoundlist } = await supabase
    .from("mysellinglist")
    .select("*")
    .eq("seller_id", userId);
  if (NotFoundlist) {
    console.log("Failed to load mysellinglist", NotFoundlist);
    return;
  }
  if (findlist && findlist.length > 0) {
    const productIds = findlist.map((item) => item.product_id);
    const { data: products, error: NotFoundSellingList } = await supabase
      .from("product")
      .select("*")
      .in("id", productIds);

    if (NotFoundSellingList) {
      console.log(
        "판매 중인 상품 목록을 불러오지 못했습니다!: ",
        NotFoundSellingList
      );
      return;
    }
    if (products && products.length > 0) {
      console.log("판매 중인 상품 정보를 성공적으로 불러왔습니다!", products);
      return products;
    }
  }
};

export const productImagesUpsert = async (data, created_id) => {
  let productId;
  if (created_id) {
    productId = created_id;
  }
  const { data: uploadProductImg, error: uploadError } = await supabase.storage
    .from("Products")
    .upload(
      `${data.seller}/first/${productId}.${data.imgType}`,
      decode(data.imgObject),
      { upsert: true }
    );
  if (uploadError) {
    console.log("Error: ", uploadError);
    return rejectWithValue(uploadError.message);
  }
  if (uploadProductImg) {
    console.log("Success to upload Product Image!", uploadProductImg);
    const result = [];
    for (const [idx, file] of data.detailFiles.entries()) {
      try {
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: "base64",
        });
        const fileExtension = file.mimeType.split("/").pop();

        const { data: detailImgUpload, error: detailImgErr } =
          await supabase.storage
            .from("Products")
            .upload(
              `${data.seller}/details/${productId}_${idx}.${fileExtension}`,
              decode(base64),
              { upsert: true }
            );

        if (detailImgErr) {
          console.log(
            `Failed to upload Product Detail Img ${idx}`,
            detailImgErr.message
          );
          return;
        }

        if (detailImgUpload) {
          console.log("상품 상세정보 이미지 업로드 완료");
          result.push(detailImgUpload);
          return { result, uploadProductImg };
        }
      } catch (fileError) {
        console.log(`Failed to process file ${file.uri}`, fileError.message);
      }
    }
  }
};
