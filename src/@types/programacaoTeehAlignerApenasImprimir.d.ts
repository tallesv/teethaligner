type ProgramacaoTeethalignerApenasImprimir = {
  id: number;
  user_id: number;
  product_name: string;
  created_at: string;
  status: string;
  patient_name: string;
  addresses: Address[];
  personalizando_o_planejamento: string;
  escaneamento_do_arco_superior: string[];
  escaneamento_do_arco_inferior: string[];
  escaneamento_do_registro_de_mordida: string[];
  escaneamento_link: string;
  encaminhei_email: boolean;
  logomarca: string;
  mensagem_personalizada_embalagem: string;
  caixa: 'Padrão' | 'Premium';
};
