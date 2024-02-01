type GuiasCirurgicos = {
  id: number;
  user_id: number;
  product_name: string;
  created_at: string;
  status: string;
  patient_name: string;
  addresses: Address[];
  informacoes_adicionais: string;
  comments: CommentType[];
  reports: ReportProps[];
  accepted: boolean | null;
  escaneamento_do_arco_superior: string[];
  escaneamento_do_arco_inferior: string[];
  escaneamento_do_registro_de_mordida: string[];
  escaneamento_link: string;
  encaminhei_email: boolean;
};
