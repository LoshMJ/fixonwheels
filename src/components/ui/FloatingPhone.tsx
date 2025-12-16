export default function FloatingPhone() {
  return (
    <div
      className="
        relative w-[210px] h-[400px] 
        bg-black rounded-[35px] border-2 border-[#282828]
        p-[7px] shadow-[2px_5px_15px_rgba(0,0,0,0.5)]
        transition-transform duration-500 hover:-translate-y-2
      "
    >
      {/* Side Buttons */}
      <div className="absolute right-[-4px] top-[30%] w-[2px] h-[45px] bg-gradient-to-r from-[#111] to-[#595959]"></div>
      <div className="absolute left-[-4px] top-[26%] w-[2px] h-[30px] bg-gradient-to-r from-[#111] to-[#595959]"></div>
      <div className="absolute left-[-4px] top-[36%] w-[2px] h-[30px] bg-gradient-to-r from-[#111] to-[#595959]"></div>

      {/* Inner Screen */}
      <div
        className="
          relative w-full h-full rounded-[25px]
          bg-gradient-to-br from-[#ff0000] via-[#ea00aa] to-[#020812]
          bg-[length:200%_200%] bg-left-bottom
          transition-all duration-[600ms]
          hover:bg-right-top
          overflow-hidden
        "
      >
        <div
          className="
            flex flex-col items-center justify-center h-full 
            text-white font-bold text-[2rem] leading-[35px]
            transition-all duration-500
            group-hover:-translate-y-5
          "
        >
          Hello
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            uiverse
          </span>
        </div>
      </div>

      {/* Top Notch */}
      <div
        className="
          absolute top-0 right-1/2 translate-x-1/2
          w-[35%] h-[18px] bg-black
          rounded-b-[10px]
        "
      >
        <div
          className="
            absolute top-[2px] right-1/2 translate-x-1/2
            w-[40%] h-[2px] bg-[#141414] rounded-[2px]
          "
        ></div>

        <div
          className="
            absolute top-[6px] right-[84%] translate-x-1/2
            w-[6px] h-[6px] rounded-full bg-white/10
          "
        >
          <div
            className="
              absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2
              w-[3px] h-[3px] rounded-full bg-blue-500/20
            "
          ></div>
        </div>
      </div>
    </div>
  );
}
