import { createContext, useContext } from "react";
import { useGetOneById } from "../../../../../lib/hooks/useGetOneById";
import { Writer, WriterService } from "../../../../../lib/repo/writer/writer.repo";

export const WriterDetailContext = createContext<
  Partial<{
    writer: Writer;
    setWriter: (writer?: Writer) => void;
  }>
>({});

type WriterProviderProps = ReactProps & {
  id: string;
};

export function WriterDetailProvider(props: WriterProviderProps) {
  const { id } = props;
  const [writer, setWriter] = useGetOneById(id, WriterService);

  return (
    <WriterDetailContext.Provider
      value={{
        writer,
        setWriter,
      }}
    >
      {props.children}
    </WriterDetailContext.Provider>
  );
}

export const useWriterDetailContext = () => useContext(WriterDetailContext);
