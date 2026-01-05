import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Section = ({ title, text }: { title: string; text: string }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
};

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Termos de Uso e Política de Privacidade
        </Text>

        <Text style={styles.updated}>Última atualização: 02/01/2026</Text>

        <Section
          title="1. Finalidade do Aplicativo"
          text="O IFPlan leite à pasto tem como objetivo auxiliar na realização de simulações, cálculos e análises com base em dados informados pelo próprio usuário. Os resultados são estimativas e não possuem caráter oficial."
        />

        <Section
          title="2. Dados Pessoais Coletados"
          text="O aplicativo coleta apenas dados fornecidos voluntariamente pelo usuário, necessários para o funcionamento das funcionalidades. Não são coletados dados sensíveis conforme a LGPD."
        />

        <Section
          title="3. Finalidade do Tratamento"
          text="Os dados são utilizados exclusivamente para o funcionamento do aplicativo, armazenamento das simulações e melhoria da experiência do usuário."
        />

        <Section
          title="4. Armazenamento e Segurança"
          text="Os dados são armazenados localmente no dispositivo do usuário ou conforme as tecnologias adotadas, com medidas razoáveis de segurança."
        />

        <Section
          title="5. Direitos do Titular"
          text="O usuário pode acessar, corrigir ou excluir seus dados a qualquer momento, conforme previsto na Lei Geral de Proteção de Dados (LGPD)."
        />

        <Section
          title="6. Compartilhamento"
          text="O compartilhamento de resultados ocorre somente mediante ação expressa do usuário."
        />

        <Section
          title="7. Responsabilidades"
          text="O aplicativo não se responsabiliza por decisões tomadas com base nos resultados apresentados."
        />

        <Section
          title="8. Contato"
          text="Em caso de dúvidas, entre em contato pelo e-mail: jarbas.vidal@ifce.edu.br"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  updated: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
});
